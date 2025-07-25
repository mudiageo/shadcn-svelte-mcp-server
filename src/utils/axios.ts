import { Axios } from "axios";
import { logError, logWarning, logInfo } from './logger.js';

// Constants for the shadcn-svelte repository structure
const REPO_OWNER = 'huntabyte';
const REPO_NAME = 'shadcn-svelte';
const REPO_BRANCH = 'main';
const DOCS_BASE_PATH = 'docs/src/lib/registry';
const REGISTRY_UI_PATH = `${DOCS_BASE_PATH}/ui`;
const REGISTRY_EXAMPLES_PATH = `${DOCS_BASE_PATH}/examples`;
const REGISTRY_BLOCKS_PATH = `${DOCS_BASE_PATH}/blocks`;
const REGISTRY_HOOKS_PATH = `${DOCS_BASE_PATH}/hooks`;
const REGISTRY_LIB_PATH = `${DOCS_BASE_PATH}/lib`;

// GitHub API for accessing repository structure and metadata
const githubApi = new Axios({
    baseURL: "https://api.github.com",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Mozilla/5.0 (compatible; ShadcnSvelteMcpServer/1.0.0)",
        ...(process.env.GITHUB_PERSONAL_ACCESS_TOKEN && {
            "Authorization": `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
        })
    },
    timeout: 30000,
    transformResponse: [(data) => {
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }],
});

// GitHub Raw for directly fetching file contents
const githubRaw = new Axios({
    baseURL: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}`,
    headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ShadcnSvelteMcpServer/1.0.0)",
    },
    timeout: 30000,
    transformResponse: [(data) => data], // Return raw data
});

/**
 * Fetch component source code from the shadcn-svelte registry
 * @param componentName Name of the component
 * @returns Promise with component source code and structure
 */
async function getComponentSource(componentName: string): Promise<any> {
    try {
        const componentPath = `${REGISTRY_UI_PATH}/${componentName.toLowerCase()}`;
        const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${componentPath}?ref=${REPO_BRANCH}`);
        
        if (!response.data) {
            throw new Error(`Component "${componentName}" not found`);
        }

        const componentStructure: any = {
            name: componentName,
            type: 'svelte-component',
            files: {},
            structure: [],
            totalFiles: 0,
            dependencies: new Set(),
            imports: new Set()
        };

        if (Array.isArray(response.data)) {
            componentStructure.totalFiles = response.data.length;
            
            for (const item of response.data) {
                if (item.type === 'file' && (item.name.endsWith('.svelte') || item.name.endsWith('.ts'))) {
                    const fileResponse = await githubRaw.get(`/${item.path}`);
                    const content = fileResponse.data;
                    
                    const dependencies = extractDependencies(content);
                    const imports = extractImports(content);
                    
                    componentStructure.files[item.name] = {
                        path: item.name,
                        content: content,
                        size: content.length,
                        lines: content.split('\n').length,
                        dependencies: dependencies,
                        imports: imports
                    };
                    
                    dependencies.forEach((dep: string) => componentStructure.dependencies.add(dep));
                    imports.forEach((imp: string) => componentStructure.imports.add(imp));
                    
                    componentStructure.structure.push({
                        name: item.name,
                        type: 'file',
                        size: content.length,
                        fileType: item.name.endsWith('.svelte') ? 'svelte' : 'typescript'
                    });
                }
            }
        }
        
        componentStructure.dependencies = Array.from(componentStructure.dependencies);
        componentStructure.imports = Array.from(componentStructure.imports);
        
        return componentStructure;
        
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error(`Component "${componentName}" not found in shadcn-svelte registry`);
        }
        throw error;
    }
}

/**
 * Fetch component demo/example from the shadcn-svelte registry
 * @param componentName Name of the component
 * @returns Promise with component demo code
 */
async function getComponentDemo(componentName: string): Promise<string> {
    try {
        const demoPatterns = [
            `${REGISTRY_EXAMPLES_PATH}/${componentName.toLowerCase()}-demo.svelte`,
            `${REGISTRY_EXAMPLES_PATH}/${componentName.toLowerCase()}.svelte`,
            `${REGISTRY_EXAMPLES_PATH}/${componentName.toLowerCase()}-01.svelte`
        ];
        
        for (const demoPath of demoPatterns) {
            try {
                const response = await githubRaw.get(`/${demoPath}`);
                if (response.status === 200) {
                    return response.data;
                }
            } catch (error) {
                // Continue to next pattern
            }
        }
        
        throw new Error(`Demo not found`);
    } catch (error) {
        throw new Error(`Demo for component "${componentName}" not found in shadcn-svelte registry`);
    }
}

/**
 * Fetch all available components from the registry
 * @returns Promise with list of component names
 */
async function getAvailableComponents(): Promise<string[]> {
    try {
        const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REGISTRY_UI_PATH}?ref=${REPO_BRANCH}`);
        
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response from GitHub API');
        }
        
        const components = response.data
            .filter((item: any) => item.type === 'dir')
            .map((item: any) => item.name);
            
        if (components.length === 0) {
            throw new Error('No components found in the registry');
        }
        
        return components.sort();
    } catch (error: any) {
        logError('Error fetching components from GitHub API', error);
        
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || 'Unknown error';
            
            if (status === 403 && message.includes('rate limit')) {
                throw new Error(`GitHub API rate limit exceeded. Please set GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits. Error: ${message}`);
            } else if (status === 404) {
                throw new Error(`Components directory not found. The path ${REGISTRY_UI_PATH} may not exist in the repository.`);
            } else if (status === 401) {
                throw new Error(`Authentication failed. Please check your GITHUB_PERSONAL_ACCESS_TOKEN if provided.`);
            } else {
                throw new Error(`GitHub API error (${status}): ${message}`);
            }
        }
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
            throw new Error(`Network error: ${error.message}. Please check your internet connection.`);
        }
        
        logWarning('Using fallback component list due to API issues');
        return getFallbackComponents();
    }
}

/**
 * Fallback list of known shadcn-svelte components
 */
function getFallbackComponents(): string[] {
    return [
        'accordion',
        'alert',
        'alert-dialog',
        'aspect-ratio',
        'avatar',
        'badge',
        'breadcrumb',
        'button',
        'calendar',
        'card',
        'carousel',
        'checkbox',
        'collapsible',
        'command',
        'context-menu',
        'dialog',
        'drawer',
        'dropdown-menu',
        'form',
        'hover-card',
        'input',
        'input-otp',
        'label',
        'menubar',
        'navigation-menu',
        'pagination',
        'popover',
        'progress',
        'radio-group',
        'resizable',
        'scroll-area',
        'select',
        'separator',
        'sheet',
        'skeleton',
        'slider',
        'sonner',
        'switch',
        'table',
        'tabs',
        'textarea',
        'toggle',
        'toggle-group',
        'tooltip'
    ];
}

/**
 * Fetch component metadata from the registry
 * @param componentName Name of the component
 * @returns Promise with component metadata
 */
async function getComponentMetadata(componentName: string): Promise<any> {
    try {
        // Try to get meta.json file from component directory
        const metaPath = `${REGISTRY_UI_PATH}/${componentName.toLowerCase()}/meta.json`;
        
        try {
            const response = await githubRaw.get(`/${metaPath}`);
            const metaData = JSON.parse(response.data);
            return {
                ...metaData,
                name: componentName,
                type: 'registry:ui',
                framework: 'svelte',
                source: 'shadcn-svelte'
            };
        } catch (error) {
            // If no meta.json, return basic metadata
            return {
                name: componentName,
                type: 'registry:ui',
                framework: 'svelte',
                dependencies: [],
                registryDependencies: [],
                source: 'shadcn-svelte'
            };
        }
    } catch (error) {
        logError(`Error getting metadata for ${componentName}`, error);
        return null;
    }
}

/**
 * Fetch block code from the shadcn-svelte blocks directory
 * @param blockName Name of the block (e.g., "calendar-01", "dashboard-01")
 * @param includeComponents Whether to include component files for complex blocks
 * @returns Promise with block code and structure
 */
async function getBlockCode(blockName: string, includeComponents: boolean = true): Promise<any> {
    try {
        // First, check if it's a simple block file (.svelte)
        try {
            const simpleBlockResponse = await githubRaw.get(`/${REGISTRY_BLOCKS_PATH}/${blockName}.svelte`);
            if (simpleBlockResponse.status === 200) {
                const code = simpleBlockResponse.data;
                
                const description = extractBlockDescription(code);
                const dependencies = extractDependencies(code);
                const components = extractComponentUsage(code);
                
                return {
                    name: blockName,
                    type: 'simple',
                    description: description || `Simple block: ${blockName}`,
                    code: code,
                    dependencies: dependencies,
                    componentsUsed: components,
                    size: code.length,
                    lines: code.split('\n').length,
                    usage: `Import and use directly in your application:\n\nimport ${blockName.charAt(0).toUpperCase() + blockName.slice(1).replace(/-/g, '')} from './blocks/${blockName}.svelte'`
                };
            }
        } catch (error) {
            // Continue to check for complex block directory
        }
        
        // Check if it's a complex block directory
        const directoryResponse = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REGISTRY_BLOCKS_PATH}/${blockName}?ref=${REPO_BRANCH}`);
        
        if (!directoryResponse.data) {
            throw new Error(`Block "${blockName}" not found`);
        }
        
        const blockStructure: any = {
            name: blockName,
            type: 'complex',
            description: `Complex block: ${blockName}`,
            files: {},
            structure: [],
            totalFiles: 0,
            dependencies: new Set(),
            componentsUsed: new Set()
        };
        
        if (Array.isArray(directoryResponse.data)) {
            blockStructure.totalFiles = directoryResponse.data.length;
            
            for (const item of directoryResponse.data) {
                if (item.type === 'file') {
                    const fileResponse = await githubRaw.get(`/${item.path}`);
                    const content = fileResponse.data;
                    
                    const description = extractBlockDescription(content);
                    const dependencies = extractDependencies(content);
                    const components = extractComponentUsage(content);
                    
                    blockStructure.files[item.name] = {
                        path: item.name,
                        content: content,
                        size: content.length,
                        lines: content.split('\n').length,
                        description: description,
                        dependencies: dependencies,
                        componentsUsed: components
                    };
                    
                    dependencies.forEach((dep: string) => blockStructure.dependencies.add(dep));
                    components.forEach((comp: string) => blockStructure.componentsUsed.add(comp));
                    
                    blockStructure.structure.push({
                        name: item.name,
                        type: 'file',
                        size: content.length,
                        description: description || `${item.name} - Block file`
                    });
                    
                    if (description && blockStructure.description === `Complex block: ${blockName}`) {
                        blockStructure.description = description;
                    }
                } else if (item.type === 'dir' && includeComponents) {
                    // Handle subdirectories (like components)
                    const subDirResponse = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${item.path}?ref=${REPO_BRANCH}`);
                    
                    if (Array.isArray(subDirResponse.data)) {
                        blockStructure.files[item.name] = {};
                        const subDirStructure: any[] = [];
                        
                        for (const subItem of subDirResponse.data) {
                            if (subItem.type === 'file') {
                                const subFileResponse = await githubRaw.get(`/${subItem.path}`);
                                const content = subFileResponse.data;
                                
                                const dependencies = extractDependencies(content);
                                const components = extractComponentUsage(content);
                                
                                blockStructure.files[item.name][subItem.name] = {
                                    path: `${item.name}/${subItem.name}`,
                                    content: content,
                                    size: content.length,
                                    lines: content.split('\n').length,
                                    dependencies: dependencies,
                                    componentsUsed: components
                                };
                                
                                dependencies.forEach((dep: string) => blockStructure.dependencies.add(dep));
                                components.forEach((comp: string) => blockStructure.componentsUsed.add(comp));
                                
                                subDirStructure.push({
                                    name: subItem.name,
                                    type: 'file',
                                    size: content.length
                                });
                            }
                        }
                        
                        blockStructure.structure.push({
                            name: item.name,
                            type: 'directory',
                            files: subDirStructure,
                            count: subDirStructure.length
                        });
                    }
                }
            }
        }
        
        blockStructure.dependencies = Array.from(blockStructure.dependencies);
        blockStructure.componentsUsed = Array.from(blockStructure.componentsUsed);
        
        blockStructure.usage = generateComplexBlockUsage(blockName, blockStructure.structure);
        
        return blockStructure;
        
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error(`Block "${blockName}" not found. Available blocks can be found in the shadcn-svelte blocks directory.`);
        }
        throw error;
    }
}

/**
 * Get all available blocks with categorization
 * @param category Optional category filter
 * @returns Promise with categorized block list
 */
async function getAvailableBlocks(category?: string): Promise<any> {
    try {
        const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REGISTRY_BLOCKS_PATH}?ref=${REPO_BRANCH}`);
        
        if (!Array.isArray(response.data)) {
            throw new Error('Unexpected response from GitHub API');
        }
        
        const blocks: any = {
            calendar: [],
            dashboard: [],
            login: [],
            sidebar: [],
            authentication: [],
            charts: [],
            other: []
        };
        
        for (const item of response.data) {
            const blockInfo: any = {
                name: item.name.replace('.svelte', ''),
                type: item.type === 'file' ? 'simple' : 'complex',
                path: item.path,
                size: item.size || 0,
                lastModified: item.download_url ? 'Available' : 'Directory'
            };
            
            // Categorize blocks based on name patterns
            if (item.name.includes('calendar')) {
                blockInfo.description = 'Calendar component for date selection and scheduling';
                blocks.calendar.push(blockInfo);
            } else if (item.name.includes('dashboard')) {
                blockInfo.description = 'Dashboard layout with charts, metrics, and data display';
                blocks.dashboard.push(blockInfo);
            } else if (item.name.includes('login') || item.name.includes('signin')) {
                blockInfo.description = 'Authentication and login interface';
                blocks.login.push(blockInfo);
            } else if (item.name.includes('sidebar')) {
                blockInfo.description = 'Navigation sidebar component';
                blocks.sidebar.push(blockInfo);
            } else if (item.name.includes('auth')) {
                blockInfo.description = 'Authentication related components';
                blocks.authentication.push(blockInfo);
            } else if (item.name.includes('chart') || item.name.includes('graph')) {
                blockInfo.description = 'Data visualization and chart components';
                blocks.charts.push(blockInfo);
            } else {
                blockInfo.description = `${item.name} - Custom UI block`;
                blocks.other.push(blockInfo);
            }
        }
        
        // Sort blocks within each category
        Object.keys(blocks).forEach(key => {
            blocks[key].sort((a: any, b: any) => a.name.localeCompare(b.name));
        });
        
        // Filter by category if specified
        if (category) {
            const categoryLower = category.toLowerCase();
            if (blocks[categoryLower]) {
                return {
                    category,
                    blocks: blocks[categoryLower],
                    total: blocks[categoryLower].length,
                    description: `${category.charAt(0).toUpperCase() + category.slice(1)} blocks available in shadcn-svelte`,
                    usage: `Use 'getBlockCode' function with the block name to get the full source code and implementation details.`
                };
            } else {
                return {
                    category,
                    blocks: [],
                    total: 0,
                    availableCategories: Object.keys(blocks).filter(key => blocks[key].length > 0),
                    suggestion: `Category '${category}' not found. Available categories: ${Object.keys(blocks).filter(key => blocks[key].length > 0).join(', ')}`
                };
            }
        }
        
        const totalBlocks = Object.values(blocks).flat().length;
        const nonEmptyCategories = Object.keys(blocks).filter(key => blocks[key].length > 0);
        
        return {
            categories: blocks,
            totalBlocks,
            availableCategories: nonEmptyCategories,
            summary: Object.keys(blocks).reduce((acc: any, key) => {
                if (blocks[key].length > 0) {
                    acc[key] = blocks[key].length;
                }
                return acc;
            }, {}),
            usage: "Use 'getBlockCode' function with a specific block name to get full source code and implementation details.",
            examples: nonEmptyCategories.slice(0, 3).map(cat => 
                blocks[cat][0] ? `${cat}: ${blocks[cat][0].name}` : ''
            ).filter(Boolean)
        };
        
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Blocks directory not found in the shadcn-svelte registry');
        }
        throw error;
    }
}

/**
 * Build directory tree for shadcn-svelte repository
 */
async function buildDirectoryTree(
    owner: string = REPO_OWNER,
    repo: string = REPO_NAME,
    path: string = DOCS_BASE_PATH,
    branch: string = REPO_BRANCH
): Promise<any> {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
        
        if (!response.data) {
            throw new Error('No data received from GitHub API');
        }

        const contents = response.data;
        
        if (!Array.isArray(contents)) {
            if (contents.message) {
                const message: string = contents.message;
                if (message.includes('rate limit exceeded')) {
                    throw new Error(`GitHub API rate limit exceeded. ${message} Consider setting GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher rate limits.`);
                } else if (message.includes('Not Found')) {
                    throw new Error(`Path not found: ${path}. The path may not exist in the repository.`);
                } else {
                    throw new Error(`GitHub API error: ${message}`);
                }
            }
            
            if (contents.type === 'file') {
                return {
                    path: contents.path,
                    type: 'file',
                    name: contents.name,
                    url: contents.download_url,
                    sha: contents.sha,
                };
            } else {
                throw new Error(`Unexpected response type from GitHub API: ${JSON.stringify(contents)}`);
            }
        }
        
        const result: Record<string, any> = {
            path,
            type: 'directory',
            children: {},
        };

        for (const item of contents) {
            if (item.type === 'file') {
                result.children[item.name] = {
                    path: item.path,
                    type: 'file',
                    name: item.name,
                    url: item.download_url,
                    sha: item.sha,
                };
            } else if (item.type === 'dir') {
                if (path.split('/').length < 8) {
                    try {
                        const subTree = await buildDirectoryTree(owner, repo, item.path, branch);
                        result.children[item.name] = subTree;
                    } catch (error) {
                        logWarning(`Failed to fetch subdirectory ${item.path}: ${error instanceof Error ? error.message : String(error)}`);
                        result.children[item.name] = {
                            path: item.path,
                            type: 'directory',
                            error: 'Failed to fetch contents'
                        };
                    }
                }
            }
        }

        return result;
    } catch (error: any) {
        logError(`Error building directory tree for ${path}`, error);
        
        if (error.message && (error.message.includes('rate limit') || error.message.includes('GitHub API error'))) {
            throw error;
        }
        
        if (error.response) {
            const status: number = error.response.status;
            const responseData: any = error.response.data;
            const message: string = responseData?.message || 'Unknown error';
            
            if (status === 404) {
                throw new Error(`Path not found: ${path}. The path may not exist in the repository.`);
            } else if (status === 403) {
                if (message.includes('rate limit')) {
                    throw new Error(`GitHub API rate limit exceeded: ${message} Consider setting GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher rate limits.`);
                } else {
                    throw new Error(`Access forbidden: ${message}`);
                }
            } else if (status === 401) {
                throw new Error(`Authentication failed. Please check your GITHUB_PERSONAL_ACCESS_TOKEN if provided.`);
            } else {
                throw new Error(`GitHub API error (${status}): ${message}`);
            }
        }
        
        throw error;
    }
}

/**
 * Extract dependencies from import statements (updated for Svelte)
 * @param code The source code to analyze
 * @returns Array of dependency names
 */
function extractDependencies(code: string): string[] {
    const dependencies: string[] = [];
    
    const importRegex = /import\s+.*?\s+from\s+['"]([@\w\/\-\.]+)['"]/g;
    let match: RegExpExecArray | null;
    
    while ((match = importRegex.exec(code)) !== null) {
        const dep: string = match[1];
        if (!dep.startsWith('./') && !dep.startsWith('../') && !dep.startsWith('$') && !dep.startsWith('/')) {
            dependencies.push(dep);
        }
    }
    
    return [...new Set(dependencies)];
}

/**
 * Extract imports from import statements (Svelte specific)
 * @param code The source code to analyze
 * @returns Array of imported items
 */
function extractImports(code: string): string[] {
    const imports: string[] = [];
    
    const patterns = [
        /import\s+\{([^}]+)\}\s+from/g,  // Named imports
        /import\s+(\w+)\s+from/g,        // Default imports
        /import\s+\*\s+as\s+(\w+)\s+from/g // Namespace imports
    ];
    
    patterns.forEach(pattern => {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(code)) !== null) {
            if (match[1].includes(',')) {
                const namedImports = match[1].split(',').map(imp => imp.trim());
                imports.push(...namedImports);
            } else {
                imports.push(match[1].trim());
            }
        }
    });
    
    return [...new Set(imports)];
}

/**
 * Extract description from block code comments
 * @param code The source code to analyze
 * @returns Extracted description or null
 */
function extractBlockDescription(code: string): string | null {
    const descriptionRegex = /\/\*\*[\s\S]*?\*\/|\/\/\s*(.+)|<!--\s*(.+?)\s*-->/;
    const match = code.match(descriptionRegex);
    if (match) {
        const description = match[0]
            .replace(/\/\*\*|\*\/|\*|\/\/|<!--|-->/g, '')
            .trim()
            .split('\n')[0]
            .trim();
        return description.length > 0 ? description : null;
    }
    
    return null;
}

/**
 * Extract component usage from code
 * @param code The source code to analyze
 * @returns Array of component names used
 */
function extractComponentUsage(code: string): string[] {
    const components: string[] = [];
    
    const importRegex = /import\s+\{([^}]+)\}\s+from/g;
    let match: RegExpExecArray | null;
    
    while ((match = importRegex.exec(code)) !== null) {
        const imports = match[1].split(',').map(imp => imp.trim());
        imports.forEach(imp => {
            if (imp[0] && imp[0] === imp[0].toUpperCase()) {
                components.push(imp);
            }
        });
    }
    
    // Look for Svelte component usage
    const svelteComponentRegex = /<([A-Z][a-zA-Z0-9]*)/g;
    while ((match = svelteComponentRegex.exec(code)) !== null) {
        components.push(match[1]);
    }
    
    return [...new Set(components)];
}

/**
 * Generate usage instructions for complex blocks
 * @param blockName Name of the block
 * @param structure Structure information
 * @returns Usage instructions string
 */
function generateComplexBlockUsage(blockName: string, structure: any[]): string {
    const hasComponents = structure.some(item => item.name === 'components');
    
    let usage = `To use the ${blockName} block:\n\n`;
    usage += `1. Copy the main files to your project:\n`;
    
    structure.forEach(item => {
        if (item.type === 'file') {
            usage += `   - ${item.name}\n`;
        } else if (item.type === 'directory' && item.name === 'components') {
            usage += `   - components/ directory (${item.count} files)\n`;
        }
    });
    
    if (hasComponents) {
        usage += `\n2. Copy the components to your components directory\n`;
        usage += `3. Update import paths as needed\n`;
        usage += `4. Ensure all dependencies are installed\n`;
    } else {
        usage += `\n2. Update import paths as needed\n`;
        usage += `3. Ensure all dependencies are installed\n`;
    }
    
    return usage;
}

/**
 * Enhanced buildDirectoryTree with fallback for rate limits
 */
async function buildDirectoryTreeWithFallback(
    owner: string = REPO_OWNER,
    repo: string = REPO_NAME,
    path: string = DOCS_BASE_PATH,
    branch: string = REPO_BRANCH
): Promise<any> {
    try {
        return await buildDirectoryTree(owner, repo, path, branch);
    } catch (error: any) {
        if (error.message && error.message.includes('rate limit') && path === DOCS_BASE_PATH) {
            logWarning('Using fallback directory structure due to rate limit');
            return getBasicSvelteStructure();
        }
        throw error;
    }
}

/**
 * Provides a basic directory structure for shadcn-svelte registry
 */
function getBasicSvelteStructure(): any {
    return {
        path: DOCS_BASE_PATH,
        type: 'directory',
        note: 'Basic structure provided due to API limitations',
        children: {
            'ui': {
                path: `${DOCS_BASE_PATH}/ui`,
                type: 'directory',
                description: 'Contains all Svelte UI components',
                note: 'Component directories with .svelte files are located here'
            },
            'examples': {
                path: `${DOCS_BASE_PATH}/examples`,
                type: 'directory',
                description: 'Contains component demo examples',
                note: 'Demo files showing component usage'
            },
            'blocks': {
                path: `${DOCS_BASE_PATH}/blocks`,
                type: 'directory',
                description: 'Contains pre-built blocks and layouts',
                note: 'Complex components and page layouts'
            },
            'hooks': {
                path: `${DOCS_BASE_PATH}/hooks`,
                type: 'directory',
                description: 'Contains custom Svelte hooks',
                note: 'Reusable Svelte hooks and utilities'
            },
            'lib': {
                path: `${DOCS_BASE_PATH}/lib`,
                type: 'directory',
                description: 'Contains utility libraries and functions',
                note: 'Helper functions and utilities'
            }
        }
    };
}

/**
 * Set or update GitHub API key for higher rate limits
 * @param apiKey GitHub Personal Access Token
 */
function setGitHubApiKey(apiKey: string): void {
    if (apiKey && apiKey.trim()) {
        (githubApi.defaults.headers as any)['Authorization'] = `Bearer ${apiKey.trim()}`;
        logInfo('GitHub API key updated successfully');
    } else {
        delete (githubApi.defaults.headers as any)['Authorization'];
        logWarning('GitHub API key removed - using unauthenticated requests');
    }
}

/**
 * Get current GitHub API rate limit status
 * @returns Promise with rate limit information
 */
async function getGitHubRateLimit(): Promise<any> {
    try {
        const response = await githubApi.get('/rate_limit');
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get rate limit info: ${error.message}`);
    }
}

export const axios = {
    githubRaw,
    githubApi,
    buildDirectoryTree: buildDirectoryTreeWithFallback,
    buildDirectoryTreeWithFallback,
    getComponentSource,
    getComponentDemo,
    getAvailableComponents,
    getComponentMetadata,
    getBlockCode,
    getAvailableBlocks,
    setGitHubApiKey,
    getGitHubRateLimit,
    // Path constants for shadcn-svelte
    paths: {
        REPO_OWNER,
        REPO_NAME,
        REPO_BRANCH,
        DOCS_BASE_PATH,
        REGISTRY_UI_PATH,
        REGISTRY_EXAMPLES_PATH,
        REGISTRY_BLOCKS_PATH,
        REGISTRY_HOOKS_PATH,
        REGISTRY_LIB_PATH
    }
}