"use client"
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FileNode } from '@webcontainer/api';
import { useSearchParams } from 'next/navigation';
import { useWebContainer } from '@/hooks/useWebContainer';
import { FileItem, Step, StepType } from '@/types';
import { parseXml } from '@/components/steps';
import { StepsList } from '@/components/StepsList';
import { Loader } from '@/components/Loader';
import { FileExplorer } from '@/components/FileExplorer';
import { CodeEditor } from '@/components/CodeEditor';
import { TabView } from '@/components/TabView';
import { PreviewFrame } from '@/components/PreviewFrame';

const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

const SearchParamsWrapper = ({ children }: { 
  children: (props: { prompt: string }) => React.ReactNode 
}) => {
  const searchparams = useSearchParams();
  const prompt = searchparams.get("prompt") || "";
  return <>{children({ prompt })}</>;
};

const BuilderContent = ({ prompt }: { prompt: string }) => {
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map((child:any) => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`/api/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`/api/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

       // Handle the response, update state accordingly

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data).map((x:any) => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));


    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data}])
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex flex-col">
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-100">Builder</h1>
        <p className="text-md text-white mt-1">Prompt: {prompt}</p>
      </header>
      
      <div className="w-full flex overflow-auto">
        <div className="w-full h-full grid grid-cols-4 gap-6 p-6">
          <div className="w-full rounded-xl space-y-6 overflow-hidden">
            <div>
              <div className=" w-full">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div>
             
              </div>
            </div>
          </div>
           <div className="col-span-1 w-60 rounded-xl bg-neutral-900">
              <FileExplorer 
                files={files} 
                onFileSelect={setSelectedFile}
              />
            </div>
          <div className="bg-neutral-900 rounded-lg  p-3 w-[870px] h-[85vh] -ml-30 -mt-5 ">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)] w-full">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer!} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Builder = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Suspense fallback={<div>Loading search params...</div>}>
        <SearchParamsWrapper>
          {(props) => <BuilderContent {...props} />}
        </SearchParamsWrapper>
      </Suspense>
    </Suspense>
  );
};

export default Builder;