/**
 * Resource templates implementation for the Model Context Protocol (MCP) server.
 * 
 * This file defines resource templates that can be used to dynamically generate
 * resources based on parameters in the URI.
 */

/**
 * Resource template definitions exported to the MCP handler
 * Each template has a name, description, uriTemplate and contentType
 */
export const resourceTemplates = [
  {
    name: 'get_install_script_for_component',
    description: 'Generate installation script for a specific shadcn-svelte component based on package manager',
    uriTemplate: 'resource-template:get_install_script_for_component?packageManager={packageManager}&component={component}',
    contentType: 'text/plain',
  },
  {
    name: 'get_installation_guide',
    description: 'Get the installation guide for shadcn-svelte based on framework and package manager',
    uriTemplate: 'resource-template:get_installation_guide?framework={framework}&packageManager={packageManager}',
    contentType: 'text/plain',
  },
];

// Create a map for easier access in getResourceTemplate
const resourceTemplateMap = {
  'get_install_script_for_component': resourceTemplates[0],
  'get_installation_guide': resourceTemplates[1],
};

/**
 * Extract parameters from URI
 * @param uri URI to extract from
 * @param paramName Name of parameter to extract
 * @returns Parameter value or undefined
 */
function extractParam(uri: string, paramName: string): string | undefined {
  const match = uri.match(new RegExp(`${paramName}=([^&]+)`));
  return match?.[1];
}

/**
 * Gets a resource template handler for a given URI
 * @param uri The URI of the resource template
 * @returns A function that generates the resource
 */
export const getResourceTemplate = (uri: string) => {
  // Component installation script template
  if (uri.startsWith('resource-template:get_install_script_for_component')) {
    return async () => {
      try {
        const packageManager = extractParam(uri, 'packageManager');
        const component = extractParam(uri, 'component');
        
        if (!packageManager) {
          return { 
            content: 'Missing packageManager parameter. Please specify npm, pnpm, or yarn.', 
            contentType: 'text/plain' 
          };
        }
        
        if (!component) {
          return { 
            content: 'Missing component parameter. Please specify the component name.', 
            contentType: 'text/plain' 
          };
        }
        
        // Generate installation script based on package manager
        let installCommand: string;
        
        switch (packageManager.toLowerCase()) {
          case 'npm':
            installCommand = `npx shadcn-svelte@latest add ${component}`;
            break;
          case 'pnpm':
            installCommand = `pnpm dlx shadcn-svelte@latest add ${component}`;
            break;
          case 'yarn':
            installCommand = `yarn dlx shadcn-svelte@latest add ${component}`;
            break;
          case 'bun':
            installCommand = `bunx --bun shadcn-svelte@latest add ${component}`;
            break;
          default:
            installCommand = `npx shadcn-svelte@latest add ${component}`;
        }
        
        return {
          content: installCommand,
          contentType: 'text/plain',
        };
      } catch (error) {
        return {
          content: `Error generating installation script: ${error instanceof Error ? error.message : String(error)}`,
          contentType: 'text/plain',
        };
      }
    };
  }
  
  // Installation guide template
  if (uri.startsWith('resource-template:get_installation_guide')) {
    return async () => {
      try {
        const framework = extractParam(uri, 'framework');
        const packageManager = extractParam(uri, 'packageManager');
        
        if (!framework) {
          return { 
            content: 'Missing framework parameter. Please specify next, vite, remix, etc.', 
            contentType: 'text/plain' 
          };
        }
        
        if (!packageManager) {
          return { 
            content: 'Missing packageManager parameter. Please specify npm, pnpm, or yarn.', 
            contentType: 'text/plain' 
          };
        }
        
        // Generate installation guide based on framework and package manager
        const guides = {
          sveltekit: {
            description: "Installation guide for SvelteKit project",
            steps: [
              "Create a SvelteKit project if you don't have one already:",
              packageManager === 'npm' ? 'npx sv create my-app' :
              packageManager === 'pnpm' ? 'pnpm dlx sv create my-app' :
              packageManager === 'yarn' ? 'yarn dlx sv create my-app' :
              packageManager === 'bun' ? 'bun x sv create my-app' : 'npx sv create my-app',
              "",
              "Navigate to your project directory:",
              "cd my-app",
              "",
              "Add TailwindCSS using the Svelte CLI:",
              packageManager === 'npm' ? 'npx sv add tailwindcss' :
              packageManager === 'pnpm' ? 'pnpm dlx sv add tailwindcss' :
              packageManager === 'yarn' ? 'yarn dlx sv add tailwindcss' :
              packageManager === 'bun' ? 'bun x sv add tailwindcss' : 'npx sv add tailwindcss',
              "",
              "Setup path aliases in svelte.config.js if not using default $lib:",
              "// Add to kit.alias if needed",
              "",
              "Run the shadcn-svelte CLI:",
              packageManager === 'npm' ? 'npx shadcn-svelte@latest init' :
              packageManager === 'pnpm' ? 'pnpm dlx shadcn-svelte@latest init' :
              packageManager === 'yarn' ? 'yarn dlx shadcn-svelte@latest init' :
              packageManager === 'bun' ? 'bun x shadcn-svelte@latest init' : 'npx shadcn-svelte@latest init',
              "",
              "Configure components.json with your preferences:",
              "- Base color: Slate",
              "- Global CSS file: src/app.css",
              "- Import aliases: $lib/components, $lib/utils, etc.",
              "",
              "Add components to your project:",
              packageManager === 'npm' ? 'npx shadcn-svelte@latest add button' :
              packageManager === 'pnpm' ? 'pnpm dlx shadcn-svelte@latest add button' :
              packageManager === 'yarn' ? 'yarn dlx shadcn-svelte@latest add button' :
              packageManager === 'bun' ? 'bun x shadcn-svelte@latest add button' : 'npx shadcn-svelte@latest add button',
              "",
              "Import and use components:",
              'import { Button } from "$lib/components/ui/button/index.js";'
            ]
          },
          vite: {
            description: "Installation guide for Vite + Svelte project",
            steps: [
              "Create a Vite + Svelte project if you don't have one already:",
              packageManager === 'npm' ? 'npm create svelte@latest my-app' :
              packageManager === 'pnpm' ? 'pnpm create svelte@latest my-app' :
              packageManager === 'yarn' ? 'yarn create svelte@latest my-app' :
              packageManager === 'bun' ? 'bun create svelte@latest my-app' : 'npm create svelte@latest my-app',
              "",
              "Navigate to your project directory:",
              "cd my-app",
              "",
              "Add TailwindCSS using the Svelte CLI:",
              packageManager === 'npm' ? 'npx sv add tailwindcss' :
              packageManager === 'pnpm' ? 'pnpm dlx sv add tailwindcss' :
              packageManager === 'yarn' ? 'yarn dlx sv add tailwindcss' :
              packageManager === 'bun' ? 'bun x sv add tailwindcss' : 'npx sv add tailwindcss',
              "",
              "Edit tsconfig.json and tsconfig.app.json to add path aliases:",
              'Add baseUrl: "." and paths: { "$lib": ["./src/lib"], "$lib/*": ["./src/lib/*"] }',
              "",
              "Update vite.config.ts with path resolution:",
              'Add alias: { $lib: path.resolve("./src/lib") }',
              "",
              "Run the shadcn-svelte CLI:",
              packageManager === 'npm' ? 'npx shadcn-svelte@latest init' :
              packageManager === 'pnpm' ? 'pnpm dlx shadcn-svelte@latest init' :
              packageManager === 'yarn' ? 'yarn dlx shadcn-svelte@latest init' :
              packageManager === 'bun' ? 'bun x shadcn-svelte@latest init' : 'npx shadcn-svelte@latest init',
              "",
              "Configure components.json with your preferences",
              "",
              "Add components to your project:",
              packageManager === 'npm' ? 'npx shadcn-svelte@latest add button' :
              packageManager === 'pnpm' ? 'pnpm dlx shadcn-svelte@latest add button' :
              packageManager === 'yarn' ? 'yarn dlx shadcn-svelte@latest add button' :
              packageManager === 'bun' ? 'bun x shadcn-svelte@latest add button' : 'npx shadcn-svelte@latest add button'
            ]
          },
          astro: {
            description: "Installation guide for Astro + Svelte project",
            steps: [
              "Create an Astro project if you don't have one already:",
              packageManager === 'npm' ? 'npm create astro@latest' :
              packageManager === 'pnpm' ? 'pnpm create astro@latest' :
              packageManager === 'yarn' ? 'yarn create astro@latest' :
              packageManager === 'bun' ? 'bun create astro@latest' : 'npm create astro@latest',
              "",
              "Navigate to your project directory and configure:",
              "Choose TypeScript: Yes, How strict: Strict",
              "",
              "Add Svelte to your Astro project:",
              packageManager === 'npm' ? 'npx astro add svelte' :
              packageManager === 'pnpm' ? 'pnpm dlx astro add svelte' :
              packageManager === 'yarn' ? 'yarn dlx astro add svelte' :
              packageManager === 'bun' ? 'bun x astro add svelte' : 'npx astro add svelte',
              "",
              "Add TailwindCSS to your Astro project:",
              packageManager === 'npm' ? 'npx astro add tailwind' :
              packageManager === 'pnpm' ? 'pnpm dlx astro add tailwind' :
              packageManager === 'yarn' ? 'yarn dlx astro add tailwind' :
              packageManager === 'bun' ? 'bun x astro add tailwind' : 'npx astro add tailwind',
              "",
              "Setup path aliases in tsconfig.json:",
              'Add baseUrl: "." and paths: { "$lib": ["./src/lib"], "$lib/*": ["./src/lib/*"] }',
              "",
              "Create global CSS file at src/styles/app.css with Tailwind imports",
              "",
              "Import app.css in src/pages/index.astro",
              "",
              "Run the shadcn-svelte CLI:",
              packageManager === 'npm' ? 'npx shadcn-svelte@latest init' :
              packageManager === 'pnpm' ? 'pnpm dlx shadcn-svelte@latest init' :
              packageManager === 'yarn' ? 'yarn dlx shadcn-svelte@latest init' :
              packageManager === 'bun' ? 'bun x shadcn-svelte@latest init' : 'npx shadcn-svelte@latest init',
              "",
              "Update astro.config.mjs to set applyBaseStyles: false for Tailwind",
              "",
              "Add components to your project:",
              packageManager === 'npm' ? 'npx shadcn-svelte@latest add button' :
              packageManager === 'pnpm' ? 'pnpm dlx shadcn-svelte@latest add button' :
              packageManager === 'yarn' ? 'yarn dlx shadcn-svelte@latest add button' :
              packageManager === 'bun' ? 'bun x shadcn-svelte@latest add button' : 'npx shadcn-svelte@latest add button',
              "",
              "Remember to use client directives in .astro files for interactive components"
            ]
          },
          manual: {
            description: "Manual installation guide for Svelte projects",
            steps: [
              "Add TailwindCSS using the Svelte CLI:",
              packageManager === 'npm' ? 'npx sv add tailwindcss' :
              packageManager === 'pnpm' ? 'pnpm dlx sv add tailwindcss' :
              packageManager === 'yarn' ? 'yarn dlx sv add tailwindcss' :
              packageManager === 'bun' ? 'bun x sv add tailwindcss' : 'npx sv add tailwindcss',
              "",
              "Install required dependencies:",
              packageManager === 'npm' ? 'npm i tailwind-variants clsx tailwind-merge tw-animate-css' :
              packageManager === 'pnpm' ? 'pnpm i tailwind-variants clsx tailwind-merge tw-animate-css' :
              packageManager === 'yarn' ? 'yarn add tailwind-variants clsx tailwind-merge tw-animate-css' :
              packageManager === 'bun' ? 'bun install tailwind-variants clsx tailwind-merge tw-animate-css' : 'npm i tailwind-variants clsx tailwind-merge tw-animate-css',
              "",
              "Install Lucide icons:",
              packageManager === 'npm' ? 'npm i @lucide/svelte' :
              packageManager === 'pnpm' ? 'pnpm i @lucide/svelte' :
              packageManager === 'yarn' ? 'yarn add @lucide/svelte' :
              packageManager === 'bun' ? 'bun install @lucide/svelte' : 'npm i @lucide/svelte',
              "",
              "Configure path aliases in your config files",
              "For SvelteKit: Update svelte.config.js",
              "For Vite: Update tsconfig.json and vite.config.ts",
              "",
              "Add the provided CSS variables and styles to your global CSS file",
              "Configure Tailwind theme with CSS variables",
              "",
              "Create a cn utility function in $lib/utils.ts:",
              "export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }",
              "",
              "Import styles in your layout file",
              "",
              "Add components to your project:",
              packageManager === 'npm' ? 'npx shadcn-svelte@latest add button' :
              packageManager === 'pnpm' ? 'pnpm dlx shadcn-svelte@latest add button' :
              packageManager === 'yarn' ? 'yarn dlx shadcn-svelte@latest add button' :
              packageManager === 'bun' ? 'bun x shadcn-svelte@latest add button' : 'npx shadcn-svelte@latest add button'
            ]
          }
        };
        
        // Select appropriate guide based on framework
        const guide = guides[framework.toLowerCase() as keyof typeof guides] || guides.sveltekit;
        
        return {
          content: `# ${guide.description} with ${packageManager}\n\n${guide.steps.join('\n')}`,
          contentType: 'text/plain',
        };
      } catch (error) {
        return {
          content: `Error generating installation guide: ${error instanceof Error ? error.message : String(error)}`,
          contentType: 'text/plain',
        };
      }
    };
  }
  
  return undefined;
};