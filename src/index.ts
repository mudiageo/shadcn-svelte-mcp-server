#!/usr/bin/env node
/**
 * Shadcn-svelte v1 MCP Server
 * 
 * A Model Context Protocol server for shadcn-svelte v1 components.
 * Provides AI assistants with access to component source code, demos, blocks, and metadata.
 * 
 * Usage:
 *   npx shadcn-svelte-mcp-server
 *   npx shadcn-svelte-mcp-server --github-api-key YOUR_TOKEN
 *   npx shadcn-svelte-mcp-server -g YOUR_TOKEN
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupHandlers } from './handler.js';
import { axios } from './utils/axios.js';
import { z } from 'zod';
import { 
  toolHandlers,
  toolSchemas
} from './tools/index.js';
import { logError, logInfo, logWarning } from './utils/logger.js';


/**
 * Parse command line arguments
 */
async function parseArgs() {
  const args = process.argv.slice(2);
  
  // Help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Shadcn-svelte v1 MCP Server

Usage:
  npx shadcn-svelte-mcp-server [options]

Options:
  --github-api-key, -g <token>    GitHub Personal Access Token for API access
  --help, -h                      Show this help message
  --version, -v                   Show version information

Examples:
  npx shadcn-svelte-mcp-server
  npx shadcn-svelte-mcp-server --github-api-key ghp_your_token_here
  npx shadcn-svelte-mcp-server -g ghp_your_token_here

Environment Variables:
  GITHUB_PERSONAL_ACCESS_TOKEN    Alternative way to provide GitHub token
  LOG_LEVEL                       Log level (debug, info, warn, error) - default: info

For more information, visit: https://github.com/Jpisnice/shadcn-svelte-mcp-server
`);
    process.exit(0);
  }

  // Version flag
  if (args.includes('--version') || args.includes('-v')) {
    // Read version from package.json
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const packagePath = path.join(__dirname, '..', 'package.json');
      
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      console.log(`shadcn-svelte-mcp-server v${packageJson.version}`);
    } catch (error) {
      console.log('shadcn-svelte-mcp-server v1.0.2');
    }
    process.exit(0);
  }

  // GitHub API key
  const githubApiKeyIndex = args.findIndex(arg => arg === '--github-api-key' || arg === '-g');
  let githubApiKey = null;
  
  if (githubApiKeyIndex !== -1 && args[githubApiKeyIndex + 1]) {
    githubApiKey = args[githubApiKeyIndex + 1];
  } else if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    githubApiKey = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  }

  return { githubApiKey };
}

/**
 * Main function to start the MCP server
 */
async function main() {
  try {
    logInfo('Starting Shadcn Svelte v1 MCP Server...');

    const { githubApiKey } = await parseArgs();

    // Configure GitHub API key if provided
    if (githubApiKey) {
      axios.setGitHubApiKey(githubApiKey);
      logInfo('GitHub API configured with token');
    } else {
      logWarning('No GitHub API key provided. Rate limited to 60 requests/hour.');
    }

    // Initialize the MCP server with metadata and capabilities
    // Following MCP SDK 1.16.0 best practices
    const server = new Server(
      {
        name: "shadcn-svelte-mcp-server",
        version: "1.0.2",
      },
      {
        capabilities: {
          resources: {
            "get_components": {
              description: "List of available shadcn-svelte components that can be used in the project",
              uri: "resource:get_components",
              contentType: "text/plain"
            }
          },
          prompts: {
            "component_usage": {
              description: "Get usage examples for a specific component",
              arguments: {
                componentName: {
                  type: "string",
                  description: "Name of the component to get usage for"
                }
              }
            },
            "component_search": {
              description: "Search for components by name or description",
              arguments: {
                query: {
                  type: "string",
                  description: "Search query"
                }
              }
            },
            "component_comparison": {
              description: "Compare two components side by side",
              arguments: {
                component1: {
                  type: "string",
                  description: "First component name"
                },
                component2: {
                  type: "string",
                  description: "Second component name"
                }
              }
            },
            "component_recommendation": {
              description: "Get component recommendations based on use case",
              arguments: {
                useCase: {
                  type: "string",
                  description: "Use case description"
                }
              }
            },
            "component_tutorial": {
              description: "Get a step-by-step tutorial for using a component",
              arguments: {
                componentName: {
                  type: "string",
                  description: "Name of the component for tutorial"
                }
              }
            }
          },
          tools: {
            "get_component": {
              description: "Get the source code for a specific shadcn-svelte v1 component",
              inputSchema: {
                type: "object",
                properties: {
                  componentName: {
                    type: "string",
                    description: "Name of the shadcn-svelte component (e.g., \"accordion\", \"button\")"
                  }
                },
                required: ["componentName"]
              }
            },
            "get_component_demo": {
              description: "Get demo code illustrating how a shadcn-svelte v1 component should be used",
              inputSchema: {
                type: "object",
                properties: {
                  componentName: {
                    type: "string",
                    description: "Name of the shadcn-svelte component (e.g., \"accordion\", \"button\")"
                  }
                },
                required: ["componentName"]
              }
            },
            "list_components": {
              description: "Get all available shadcn-svelte v1 components",
              inputSchema: {
                type: "object",
                properties: {}
              }
            },
            "get_component_metadata": {
              description: "Get metadata for a specific shadcn-svelte v1 component",
              inputSchema: {
                type: "object",
                properties: {
                  componentName: {
                    type: "string",
                    description: "Name of the shadcn-svelte component (e.g., \"accordion\", \"button\")"
                  }
                },
                required: ["componentName"]
              }
            },
            "get_directory_structure": {
              description: "Get the directory structure of the shadcn-svelte v1 repository",
              inputSchema: {
                type: "object",
                properties: {
                  path: {
                    type: "string",
                    description: "Path within the repository (default: v1 registry)"
                  },
                  owner: {
                    type: "string",
                    description: "Repository owner (default: \"huntabyte\")"
                  },
                  repo: {
                    type: "string",
                    description: "Repository name (default: \"shadcn-svelte\")"
                  },
                  branch: {
                    type: "string",
                    description: "Branch name (default: \"main\")"
                  }
                }
              }
            },
            "get_block": {
              description: "Get source code for a specific shadcn-svelte v1 block (e.g., calendar-01, dashboard-01)",
              inputSchema: {
                type: "object",
                properties: {
                  blockName: {
                    type: "string",
                    description: "Name of the block (e.g., \"calendar-01\", \"dashboard-01\", \"login-02\")"
                  },
                  includeComponents: {
                    type: "boolean",
                    description: "Whether to include component files for complex blocks (default: true)"
                  }
                },
                required: ["blockName"]
              }
            },
            "list_blocks": {
              description: "Get all available shadcn-svelte v1 blocks with categorization",
              inputSchema: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    description: "Filter by category (calendar, dashboard, login, sidebar, products)"
                  }
                }
              }
            }
          }
        }
      }
    );

    // Set up request handlers and register components (tools, resources, etc.)
    setupHandlers(server);

    // Start server using stdio transport
    const transport = new StdioServerTransport();
    
    logInfo('Transport initialized: stdio');

    await server.connect(transport);
    
    logInfo('Server started successfully');

  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  logError('Unhandled startup error', error);
  process.exit(1);
});