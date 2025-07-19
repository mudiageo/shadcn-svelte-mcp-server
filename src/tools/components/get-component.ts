import { axios } from '../../utils/axios.js';

export async function handleGetComponent({ componentName }: { componentName: string }) {
  try {
    const sourceCode = await axios.getComponentSource(componentName);
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    console.error(`Failed to get component "${componentName}":`, error);
    throw new Error(`Failed to get component "${componentName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  componentName: {
    type: 'string',
    description: 'Name of the shadcn/ui component (e.g., "accordion", "button")'
  }
}; 