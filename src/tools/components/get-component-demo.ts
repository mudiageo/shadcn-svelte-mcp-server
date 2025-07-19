import { axios } from '../../utils/axios.js';

export async function handleGetComponentDemo({ componentName }: { componentName: string }) {
  try {
    const demoCode = await axios.getComponentDemo(componentName);
    return {
      content: [{ type: "text", text: demoCode }]
    };
  } catch (error) {
    console.error(`Failed to get demo for component "${componentName}":`, error);
    throw new Error(`Failed to get demo for component "${componentName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  componentName: {
    type: 'string',
    description: 'Name of the shadcn/ui component (e.g., "accordion", "button")'
  }
}; 