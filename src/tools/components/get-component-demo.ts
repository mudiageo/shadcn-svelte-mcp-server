import { axios } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetComponentDemo({ componentName }: { componentName: string }) {
  try {
    const demoCode = await axios.getComponentDemo(componentName);
    return {
      content: [{ type: "text", text: demoCode }]
    };
  } catch (error) {
    logError(`Failed to get demo for component "${componentName}"`, error);
    throw new Error(`Failed to get demo for component "${componentName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  componentName: {
    type: 'string',
    description: 'Name of the shadcn-svelte component (e.g., "accordion", "button")'
  }
}; 