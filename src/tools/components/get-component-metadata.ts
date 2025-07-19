import { axios } from '../../utils/axios.js';

export async function handleGetComponentMetadata({ componentName }: { componentName: string }) {
  try {
    const metadata = await axios.getComponentMetadata(componentName);
    if (!metadata) {
      throw new Error(`Component metadata not found: ${componentName}`);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(metadata, null, 2) }]
    };
  } catch (error) {
    console.error(`Failed to get metadata for component "${componentName}":`, error);
    throw new Error(`Failed to get metadata for component "${componentName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  componentName: {
    type: 'string',
    description: 'Name of the shadcn/ui component (e.g., "accordion", "button")'
  }
}; 