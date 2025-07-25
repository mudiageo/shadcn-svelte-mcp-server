import { axios } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetDirectoryStructure({ 
  path, 
  owner, 
  repo, 
  branch 
}: { 
  path?: string, 
  owner?: string, 
  repo?: string, 
  branch?: string 
}) {
  try {
    const directoryTree = await axios.buildDirectoryTree(
      owner || axios.paths.REPO_OWNER,
      repo || axios.paths.REPO_NAME,
      path || axios.paths.REGISTRY_UI_PATH,
      branch || axios.paths.REPO_BRANCH
    );
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify(directoryTree, null, 2)
      }]
    };
  } catch (error) {
    logError('Failed to get directory structure', error);
    throw new Error(`Failed to get directory structure: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  path: {
    type: 'string',
    description: 'Path within the repository (default: v4 registry)'
  },
  owner: {
    type: 'string',
    description: 'Repository owner (default: "huntabyte")'
  },
  repo: {
    type: 'string',
    description: 'Repository name (default: "shadcn-svelte")'
  },
  branch: {
    type: 'string',
    description: 'Branch name (default: "main")'
  }
}; 