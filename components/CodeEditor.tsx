import React from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        Select a file to view its contents
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="typescript"
      className='bg-neutral-800 rounded-lg'
      theme="vs-dark"
      value={file.content || ''}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      }}
    />
  );
}