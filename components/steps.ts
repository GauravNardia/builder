import { Step, StepType } from "@/types";

export function parseXml(response: string): Step[] {
  if (typeof response !== 'string' || response.trim() === '') {
      console.error("Invalid XML input.");
      return [];
  }

  // Extract the XML content between <boltArtifact> tags
  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);
  
  if (!xmlMatch) {
      console.error("No boltArtifact found in the input.");
      return [];
  }

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let baseId = Date.now(); // Use timestamp as base for unique IDs

  // Extract artifact title
  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  // Add initial artifact step
  steps.push({
      id: baseId++,
      title: artifactTitle,
      description: '',
      type: StepType.CreateFolder,
      status: 'pending'
  });

  // Regular expression to find boltAction elements
  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
  
  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
      // Ensure match has the expected structure
      if (!match || match.length < 4) {
          console.error("Invalid match structure:", match);
          continue;
      }

      const [, type, filePath, content] = match;

      if (!type) {
          console.error("Missing type in match");
          continue;
      }

      if (type === 'file') {
          // File creation step
          steps.push({
              id: baseId++,
              title: `Create ${filePath || 'file'}`,
              description: '',
              type: StepType.CreateFile,
              status: 'pending',
              code: content?.trim() || '',
              path: filePath
          });
      } else if (type === 'shell') {
          // Shell command step
          steps.push({
              id: baseId++,
              title: 'Run command',
              description: '',
              type: StepType.RunScript,
              status: 'pending',
              code: content?.trim() || ''
          });
      }
  }

  return steps;
}
