/**
 * Prompts implementation for the Model Context Protocol (MCP) server.
 * 
 * This file defines prompts that guide the AI model's responses.
 * Prompts help to direct the model on how to process user requests.
 */

/**
 * List of prompts metadata available in this MCP server
 * Each prompt must have a name, description, and arguments if parameters are needed
 */
export const prompts = {
    "build-shadcn-page": {
      name: "build-shadcn-page",
      description: "Generate a complete shadcn-svelte page using v1 components and blocks",
      arguments: [
          { 
              name: "pageType",
              description: "Type of page to build (dashboard, login, calendar, sidebar, products, custom)",
              required: true,
          },
          {
              name: "features",
              description: "Specific features or components needed (comma-separated)"
          },
          {
              name: "layout",
              description: "Layout preference (sidebar, header, full-width, centered)"
          },
          {
              name: "style",
              description: "Design style (minimal, modern, enterprise, creative)"
          }
      ],
    },
    "create-dashboard": {
      name: "create-dashboard",
      description: "Create a comprehensive dashboard using shadcn-svelte v1 blocks and components",
      arguments: [
          {
              name: "dashboardType",
              description: "Type of dashboard (analytics, admin, user, project, sales)",
              required: true,
          },
          {
              name: "widgets",
              description: "Dashboard widgets needed (charts, tables, cards, metrics)"
          },
          {
              name: "navigation",
              description: "Navigation style (sidebar, top-nav, breadcrumbs)"
          }
      ],
    },
    "create-auth-flow": {
      name: "create-auth-flow",
      description: "Generate authentication pages using shadcn-svelte v1 login blocks",
      arguments: [
          {
              name: "authType",
              description: "Authentication type (login, register, forgot-password, two-factor)",
              required: true,
          },
          {
              name: "providers",
              description: "Auth providers (email, google, github, apple)"
          },
          {
              name: "features",
              description: "Additional features (remember-me, social-login, validation)"
          }
      ],
    },
    "optimize-shadcn-component": {
      name: "optimize-shadcn-component",
      description: "Optimize or enhance existing shadcn-svelte components with best practices",
      arguments: [
          {
              name: "component",
              description: "Component name to optimize",
              required: true,
          },
          {
              name: "optimization",
              description: "Type of optimization (performance, accessibility, responsive, animations)"
          },
          {
              name: "useCase",
              description: "Specific use case or context for the component"
          }
      ],
    },
    "create-data-table": {
      name: "create-data-table",
      description: "Create advanced data tables with shadcn-svelte components",
      arguments: [
          {
              name: "dataType",
              description: "Type of data to display (users, products, orders, analytics)",
              required: true,
          },
          {
              name: "features",
              description: "Table features (sorting, filtering, pagination, search, selection)"
          },
          {
              name: "actions",
              description: "Row actions (edit, delete, view, custom)"
          }
      ],
    },
  };
  
/**
 * Map of prompt names to their handler functions
 * Each handler generates the actual prompt content with the provided parameters
 */
export const promptHandlers = {
    "build-shadcn-page": ({ pageType, features = "", layout = "sidebar", style = "modern" }: { 
      pageType: string, features?: string, layout?: string, style?: string 
    }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a complete ${pageType} page using shadcn-svelte v1 components and blocks. 

REQUIREMENTS:
- Page Type: ${pageType}
- Features: ${features || 'Standard features for this page type'}
- Layout: ${layout}
- Design Style: ${style}

INSTRUCTIONS:
1. Use the MCP tools to explore available v1 blocks for this page type:
   - Use 'list_blocks' to see available categories
   - Use 'get_block' to fetch specific block implementations

2. Build the page following these principles:
   - Use shadcn-svelte v1 components and blocks as building blocks
   - Ensure responsive design with Tailwind CSS classes
   - Implement proper TypeScript types
   - Follow Svelte 5 best practices and patterns
   - Include proper accessibility attributes

3. For ${pageType} pages specifically:
   ${getPageTypeSpecificInstructions(pageType)}

4. Code Structure:
   - Create a main page component
   - Use sub-components for complex sections
   - Include proper imports from shadcn-svelte registry
   - Add necessary state management with Svelte 5 runes.
   - Include proper error handling

5. Styling Guidelines:
   - Use consistent spacing and typography
   - Implement ${style} design principles
   - Ensure dark/light mode compatibility
   - Use shadcn-svelte design tokens

Please provide complete, production-ready code with proper imports and TypeScript types.`,
            },
          },
        ],
      };
    },

    "create-dashboard": ({ dashboardType, widgets = "charts,tables,cards", navigation = "sidebar" }: { 
      dashboardType: string, widgets?: string, navigation?: string 
    }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a comprehensive ${dashboardType} dashboard using shadcn-svelte v1 blocks and components.

REQUIREMENTS:
- Dashboard Type: ${dashboardType}
- Widgets: ${widgets}
- Navigation: ${navigation}

INSTRUCTIONS:
1. First, explore available dashboard blocks:
   - Use 'list_blocks' with category="dashboard" to see available dashboard blocks
   - Use 'get_block' to examine dashboard-01 and other dashboard implementations
   - Study the structure and component usage

2. Dashboard Structure:
   - Implement ${navigation} navigation using appropriate shadcn-svelte components
   - Create a responsive grid layout for widgets
   - Include proper header with user menu and notifications
   - Add breadcrumb navigation

3. Widgets to Include:
   ${widgets.split(',').map(widget => `- ${widget.trim()} with real-time data simulation`).join('\n   ')}

4. Key Features:
   - Responsive design that works on mobile, tablet, and desktop
   - Interactive charts using a charting library compatible with shadcn-svelte
   - Data tables with sorting, filtering, and pagination
   - Modal dialogs for detailed views
   - Toast notifications for user feedback

5. Data Management:
   - Create mock data structures for ${dashboardType}
   - Implement state management with React hooks
   - Add loading states and error handling
   - Include data refresh functionality

6. Accessibility:
   - Proper ARIA labels and roles
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast compliance

Provide complete code with all necessary imports, types, and implementations.`,
            },
          },
        ],
      };
    },

    "create-auth-flow": ({ authType, providers = "email", features = "validation" }: { 
      authType: string, providers?: string, features?: string 
    }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a complete ${authType} authentication flow using shadcn-svelte v1 login blocks and components.

REQUIREMENTS:
- Auth Type: ${authType}
- Providers: ${providers}
- Features: ${features}

INSTRUCTIONS:
1. Explore login blocks first:
   - Use 'list_blocks' with category="login" to see available login blocks
   - Use 'get_block' to examine login-01, login-02, etc. implementations
   - Study different authentication patterns and layouts

2. Authentication Components:
   - Form validation using superforms or similar
   - Input components with proper error states
   - Loading states during authentication
   - Success/error feedback with toast notifications

3. Providers Implementation:
   ${providers.split(',').map(provider => 
     `- ${provider.trim()}: Implement ${provider.trim()} authentication UI`
   ).join('\n   ')}

4. Security Features:
   - Form validation with proper error messages
   - Password strength indicator (if applicable)
   - CSRF protection considerations
   - Secure form submission patterns

5. UX Considerations:
   - Smooth transitions between auth states
   - Clear error messaging
   - Progressive enhancement
   - Mobile-friendly design
   - Remember me functionality (if applicable)

6. Form Features:
   ${features.split(',').map(feature => 
     `- ${feature.trim()}: Implement ${feature.trim()} functionality`
   ).join('\n   ')}

7. Layout Options:
   - Choose appropriate layout from available login blocks
   - Center-aligned forms with proper spacing
   - Background images or gradients (optional)
   - Responsive design for all screen sizes

Provide complete authentication flow code with proper TypeScript types, validation, and error handling.`,
            },
          },
        ],
      };
    },

    "optimize-shadcn-component": ({ component, optimization = "performance", useCase = "general" }: { 
      component: string, optimization?: string, useCase?: string 
    }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Optimize the ${component} shadcn-svelte component for ${optimization} and ${useCase} use case.

REQUIREMENTS:
- Component: ${component}
- Optimization Focus: ${optimization}
- Use Case: ${useCase}

INSTRUCTIONS:
1. First, analyze the current component:
   - Use 'get_component' to fetch the ${component} source code
   - Use 'get_component_demo' to see current usage examples
   - Use 'get_component_metadata' to understand dependencies

2. Optimization Strategy for ${optimization}:
   ${getOptimizationInstructions(optimization)}

3. Use Case Specific Enhancements for ${useCase}:
   - Analyze how ${component} is typically used in ${useCase} scenarios
   - Identify common patterns and pain points
   - Suggest improvements for better developer experience

4. Implementation:
   - Provide optimized component code
   - Include performance benchmarks or considerations
   - Add proper TypeScript types and interfaces
   - Include usage examples demonstrating improvements

5. Best Practices:
   - Follow Svelte 5 performance best practices
   - Implement proper memoization where needed
   - Ensure backward compatibility
   - Add comprehensive prop validation

6. Testing Considerations:
   - Suggest test cases for the optimized component
   - Include accessibility testing recommendations
   - Performance testing guidelines

Provide the optimized component code with detailed explanations of improvements made.`,
            },
          },
        ],
      };
    },

    "create-data-table": ({ dataType, features = "sorting,filtering,pagination", actions = "edit,delete" }: { 
      dataType: string, features?: string, actions?: string 
    }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create an advanced data table for ${dataType} using shadcn-svelte v1 components.

REQUIREMENTS:
- Data Type: ${dataType}
- Features: ${features}
- Actions: ${actions}

INSTRUCTIONS:
1. Explore table components:
   - Use 'get_component' for 'table' to see the base table implementation
   - Use 'get_component_demo' for 'table' to see usage examples
   - Look for any existing table blocks in the blocks directory

2. Table Structure:
   - Create a reusable DataTable component
   - Define proper TypeScript interfaces for ${dataType} data
   - Implement column definitions with proper typing
   - Add responsive table design

3. Features Implementation:
   ${features.split(',').map(feature => {
     const featureInstructions: Record<string, string> = {
       'sorting': '- Column sorting (ascending/descending) with visual indicators',
       'filtering': '- Global search and column-specific filters',
       'pagination': '- Page-based navigation with configurable page sizes',
       'search': '- Real-time search across all columns',
       'selection': '- Row selection with bulk actions support'
     };
     return featureInstructions[feature.trim()] || `- ${feature.trim()}: Implement ${feature.trim()} functionality`;
   }).join('\n   ')}

4. Row Actions:
   ${actions.split(',').map(action => 
     `- ${action.trim()}: Implement ${action.trim()} action with proper confirmation dialogs`
   ).join('\n   ')}

5. Data Management:
   - Create mock data for ${dataType}
   - Implement data fetching patterns (loading states, error handling)
   - Add optimistic updates for actions
   - Include data validation

6. UI/UX Features:
   - Loading skeletons during data fetch
   - Empty states when no data is available
   - Error states with retry functionality
   - Responsive design for mobile devices
   - Keyboard navigation support

7. Advanced Features:
   - Column resizing and reordering
   - Export functionality (CSV, JSON)
   - Bulk operations
   - Virtual scrolling for large datasets (if needed)

Provide complete data table implementation with proper TypeScript types, mock data, and usage examples.`,
            },
          },
        ],
      };
    },
};

/**
 * Helper function to get page type specific instructions
 */
function getPageTypeSpecificInstructions(pageType: string): string {
  const instructions = {
    dashboard: `
   - Use dashboard blocks as foundation (dashboard-01)
   - Include metrics cards, charts, and data tables
   - Implement sidebar navigation with proper menu structure
   - Add header with user profile and notifications
   - Create responsive grid layout for widgets`,
    
    login: `
   - Use login blocks as reference (login-01 through login-05)
   - Implement form validation with clear error messages
   - Add social authentication options if specified
   - Include forgot password and sign-up links
   - Ensure mobile-responsive design`,
    
    calendar: `
   - Use calendar blocks (calendar-01 through calendar-32)
   - Implement different calendar views (month, week, day)
   - Add event creation and management
   - Include date navigation and filtering
   - Support event categories and colors`,
    
    sidebar: `
   - Use sidebar blocks as foundation (sidebar-01 through sidebar-16)
   - Implement collapsible navigation
   - Add proper menu hierarchy
   - Include search functionality
   - Support both light and dark themes`,
    
    products: `
   - Use products blocks as reference (products-01)
   - Create product grid/list views
   - Implement filtering and sorting
   - Add product details modal or page
   - Include shopping cart functionality if needed`,
    
    custom: `
   - Analyze requirements and choose appropriate blocks
   - Combine multiple block patterns as needed
   - Focus on component reusability
   - Ensure consistent design patterns`
  };
  
  return instructions[pageType as keyof typeof instructions] || instructions.custom;
}

/**
 * Helper function to get optimization specific instructions
 */
function getOptimizationInstructions(optimization: string): string {
  const instructions = {
    performance: `
   - Implement virtual scrolling for large lists
   - Minimize DOM manipulations
   - Use the dynamic import(...) form to selectively lazy-load components rhat are need based on a conditiom
   - Use $derived and $derived.by for efficient computed values that only update when dependencies change
   - Implement $effect for side effects with automatic cleanup and dependency tracking
   - Leverage Svelte's built-in reactivity with $state for optimal re-rendering
   - Avoid unnecessary reactive blocks by using $effect.pre for DOM measurements`,
   
    accessibility: `
   - Add proper ARIA labels and roles
   - Ensure keyboard navigation support
   - Implement focus management
   - Add screen reader compatibility
   - Ensure color contrast compliance
   - Support high contrast mode`,
   
    responsive: `
   - Implement mobile-first design approach
   - Use CSS Grid and Flexbox effectively
   - Add proper breakpoints for all screen sizes
   - Optimize touch interactions for mobile
   - Ensure readable text sizes on all devices
   - Implement responsive navigation patterns`,
   
    animations: `
   - Add smooth transitions between states
   - Implement loading animations and skeletons
   - Use CSS transforms for better performance
   - Add hover and focus animations
   - Implement page transition animations
   - Ensure animations respect reduced motion preferences`
  };
  
  return instructions[optimization as keyof typeof instructions] || 
         'Focus on general code quality improvements and best practices implementation.';
}