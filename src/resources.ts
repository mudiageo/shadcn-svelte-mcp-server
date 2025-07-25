/**
 * Resources implementation for the Model Context Protocol (MCP) server.
 * 
 * This file defines the resources that can be returned by the server based on client requests.
 * Resources are static content or dynamically generated content referenced by URIs.
 */

import { logError } from './utils/logger.js';

/**
 * Resource definitions exported to the MCP handler
 * Each resource has a name, description, uri and contentType
 */
export const resources = [
  {
    name: 'get_components',
    description: 'List of available shadcn-svelte components that can be used in the project',
    uri: 'resource:get_components',
    contentType: 'text/plain',
  }
];

/**
 * Handler for the get_components resource
 * @returns List of available shadcn-svelte components
 */
const getComponentsList = async () => {
  try {
    // List of available components in shadcn-svelte
    // This hardcoded list can be updated in the future if needed
    const components = [
      "accordion",
      "alert",
      "alert-dialog",
      "aspect-ratio",
      "avatar",
      "badge",
      "breadcrumb",
      "button",
      "calendar",
      "card",
      "carousel",
      "checkbox",
      "collapsible",
      "command",
      "context-menu",
      "data-table",
      "date-picker",
      "dialog",
      "drawer",
      "dropdown-menu",
      "form",
      "hover-card",
      "input",
      "label",
      "menubar",
      "navigation-menu",
      "pagination",
      "popover",
      "progress",
      "radio-group",
      "resizable",
      "scroll-area",
      "select",
      "separator",
      "sheet",
      "skeleton",
      "slider",
      "sonner",
      "switch",
      "table",
      "tabs",
      "textarea",
      "toast",
      "toggle",
      "toggle-group",
      "tooltip"
    ];
    
    return {
      content: JSON.stringify(components, null, 2),
      contentType: 'application/json',
    };
  } catch (error) {
    logError("Error fetching components list", error);
    return {
      content: JSON.stringify({
        error: "Failed to fetch components list",
        message: error instanceof Error ? error.message : String(error)
      }, null, 2),
      contentType: 'application/json',
    };
  }
};

/**
 * Map of resource URIs to their handler functions
 * Each handler function returns the resource content when requested
 */
export const resourceHandlers = {
  'resource:get_components': getComponentsList,
};