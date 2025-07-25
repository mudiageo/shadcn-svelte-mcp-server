#!/bin/bash

# Example usage script for shadcn-svelte-mcp-server
# This demonstrates different ways to use the package

echo "🚀 Shadcn Svelte MCP Server - Usage Examples"
echo "========================================"
echo ""

# Basic usage
echo "1️⃣  Basic Usage (no GitHub token - rate limited):"
echo "   npx shadcn-svelte-mcp-server"
echo ""

# With GitHub token via argument
echo "2️⃣  With GitHub Token (command line):"
echo "   npx shadcn-svelte-mcp-server --github-api-key ghp_your_token_here"
echo "   npx shadcn-svelte-mcp-server -g ghp_your_token_here"
echo ""

# With environment variable
echo "3️⃣  With GitHub Token (environment variable):"
echo "   export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here"
echo "   npx shadcn-svelte-mcp-server"
echo ""

# Claude Desktop integration
echo "4️⃣  Claude Desktop Integration:"
echo "   Add to ~/.config/Claude/claude_desktop_config.json:"
echo '   {'
echo '     "mcpServers": {'
echo '       "shadcn-svelte": {'
echo '         "command": "npx",'
echo '         "args": ["shadcn-svelte-mcp-server", "--github-api-key", "ghp_your_token"]'
echo '       }'
echo '     }'
echo '   }'
echo ""

# Continue.dev integration
echo "5️⃣  Continue.dev Integration:"
echo "   Add to .continue/config.json:"
echo '   {'
echo '     "tools": [{'
echo '       "name": "shadcn-svelte",'
echo '       "type": "mcp",'
echo '       "command": "npx",'
echo '       "args": ["shadcn-svelte-mcp-server"],'
echo '       "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token"}'
echo '     }]'
echo '   }'
echo ""

# Available tools
echo "🛠️  Available Tools:"
echo "   • get_component         - Get component source code"
echo "   • get_component_demo    - Get component usage examples"
echo "   • list_components       - List all available components"
echo "   • get_component_metadata - Get component dependencies"
echo "   • get_block             - Get complete block implementations"
echo "   • list_blocks           - List all available blocks"
echo "   • get_directory_structure - Explore repository structure"
echo ""

echo "📚 For more information:"
echo "   npx shadcn-svelte-mcp-server --help"
echo "   https://github.com/mudiageo/shadcn-svelte-mcp-server"
