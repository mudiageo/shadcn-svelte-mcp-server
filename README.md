# Shadcn Svelte MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to [shadcn-svelte](https://www.shadcn-svelte.com/) components, blocks, demos, and metadata. This server enables AI tools like Claude Desktop, Continue.dev, VS Code, Cursor, and other MCP-compatible clients to retrieve and work with shadcn-svelte components more effectively.

> **Note**: This project is forked from [Jpisnice/shadcn-ui-mcp-server](https://github.com/Jpisnice/shadcn-ui-mcp-server) - a fantastic MCP server for the original shadcn/ui React components. This fork adapts the functionality specifically for shadcn-svelte components.

## 🚀 Key Features

- **Component Source Code**: Get the latest shadcn-svelte component source code
- **Component Demos**: Access example implementations and usage patterns for Svelte components
- **Blocks Support**: Retrieve complete block implementations (dashboards, calendars, login forms, etc.) adapted for Svelte
- **Metadata Access**: Get component dependencies, descriptions, and configuration details for Svelte
- **Directory Browsing**: Explore the shadcn-svelte repository structure
- **GitHub API Integration**: Efficient caching and intelligent rate limit handling

## 📦 Quick Start

### ⚡ Using npx (Recommended)

The fastest way to get started - no installation required!

```bash
# Basic usage (rate limited to 60 requests/hour)
npx shadcn-svelte-mcp-server

# With GitHub token for better rate limits (5000 requests/hour)
npx shadcn-svelte-mcp-server --github-api-key ghp_your_token_here

# Short form
npx shadcn-svelte-mcp-server -g ghp_your_token_here

# Using environment variable
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
npx shadcn-svelte-mcp-server
```

**🎯 Try it now**: Run `npx shadcn-svelte-mcp-server --help` to see all options!

### 🔧 Command Line Options

```bash
shadcn-svelte-mcp-server [options]

Options:
  --github-api-key, -g <token>    GitHub Personal Access Token
  --help, -h                      Show help message  
  --version, -v                   Show version information

Environment Variables:
  GITHUB_PERSONAL_ACCESS_TOKEN    Alternative way to provide GitHub token

Examples:
  npx shadcn-svelte-mcp-server --help
  npx shadcn-svelte-mcp-server --version
  npx shadcn-svelte-mcp-server -g ghp_1234567890abcdef
  GITHUB_PERSONAL_ACCESS_TOKEN=ghp_token npx shadcn-svelte-mcp-server
```

## 🔑 GitHub API Token Setup

**Why do you need a token?**
- Without token: Limited to 60 API requests per hour
- With token: Up to 5,000 requests per hour
- Better reliability and faster responses

### 📝 Getting Your Token (2 minutes)

1. **Go to GitHub Settings**:
   - Visit [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Or: GitHub Profile → Settings → Developer settings → Personal access tokens

2. **Generate New Token**:
   - Click "Generate new token (classic)"
   - Add a note: "shadcn-svelte MCP server"
   - **Expiration**: Choose your preference (90 days recommended)
   - **Scopes**: ✅ **No scopes needed!** (public repository access is sufficient)

3. **Copy Your Token**:
   - Copy the generated token (starts with `ghp_`)
   - ⚠️ **Save it securely** - you won't see it again!

### 🚀 Using Your Token

**Method 1: Command Line (Quick testing)**
```bash
npx shadcn-svelte-mcp-server --github-api-key ghp_your_token_here
```

**Method 2: Environment Variable (Recommended)**
```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# Then simply run:
npx shadcn-svelte-mcp-server
```

## 🛠️ Editor Integration

### VS Code Integration

#### Method 1: Using Continue Extension

1. **Install Continue Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Continue" and install it

2. **Configure MCP Server**:
   - Open Command Palette (Ctrl+Shift+P)
   - Type "Continue: Configure" and select it
   - Add this configuration to your settings:

```json
{
  "continue.server": {
    "mcpServers": {
      "shadcn-svelte": {
        "command": "npx",
        "args": ["shadcn-svelte-mcp-server", "--github-api-key", "ghp_your_token_here"]
      }
    }
  }
}
```

#### Method 2: Using Claude Extension

1. **Install Claude Extension**:
   - Search for "Claude" in VS Code extensions
   - Install the official Claude extension

2. **Configure MCP Server**:
   - Add to your VS Code settings.json:

```json
{
  "claude.mcpServers": {
    "shadcn-svelte": {
      "command": "npx",
      "args": ["shadcn-svelte-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Cursor Integration

#### Method 1: Global Configuration

1. **Open Cursor Settings**:
   - Go to Settings (Cmd/Ctrl + ,)
   - Search for "MCP" or "Model Context Protocol"

2. **Add MCP Server Configuration**:
```json
{
  "mcpServers": {
    "shadcn-svelte": {
      "command": "npx",
      "args": ["shadcn-svelte-mcp-server", "--github-api-key", "ghp_your_token_here"]
    }
  }
}
```

#### Method 2: Workspace Configuration

Create a `.cursorrules` file in your project root:

```json
{
  "mcpServers": {
    "shadcn-svelte": {
      "command": "npx",
      "args": ["shadcn-svelte-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Claude Desktop Integration

Add to your Claude Desktop configuration (`~/.config/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "shadcn-svelte": {
      "command": "npx",
      "args": ["shadcn-svelte-mcp-server", "--github-api-key", "ghp_your_token_here"]
    }
  }
}
```

Or with environment variable:

```json
{
  "mcpServers": {
    "shadcn-svelte": {
      "command": "npx",
      "args": ["shadcn-svelte-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Continue.dev Integration

1. **Install Continue.dev**:
   - Download from [continue.dev](https://continue.dev)
   - Install the application

2. **Configure MCP Server**:
   - Open Continue.dev
   - Go to Settings → MCP Servers
   - Add new server:

```json
{
  "name": "shadcn-svelte",
  "command": "npx",
  "args": ["shadcn-svelte-mcp-server", "--github-api-key", "ghp_your_token_here"]
}
```

## 🎯 Usage Examples

### Getting Component Source Code

Ask your AI assistant:
```
"Show me the source code for the shadcn-svelte button component"
```

The AI can now access the complete Svelte component source code for the button component.

### Creating a Dashboard

Ask your AI assistant:
```
"Create a dashboard using shadcn-svelte components. Use the dashboard-01 block as a starting point"
```

The AI can retrieve the complete dashboard block implementation and customize it for your Svelte needs.

### Building a Login Form

Ask your AI assistant:
```
"Help me build a login form using shadcn-svelte components. Show me the available form components"
```

The AI can list all available Svelte components and help you build the form.

## 🛠️ Available Tools

The MCP server provides these tools for AI assistants:

### Component Tools

- **`get_component`** - Get Svelte component source code
- **`get_component_demo`** - Get Svelte component usage examples
- **`list_components`** - List all available shadcn-svelte components
- **`get_component_metadata`** - Get component dependencies and info

### Block Tools

- **`get_block`** - Get complete block implementations adapted for Svelte
- **`list_blocks`** - List all available blocks with categories

### Repository Tools

- **`get_directory_structure`** - Explore the shadcn-svelte repository structure

### Example Tool Usage

```typescript
// These tools can be called by AI assistants via MCP protocol

// Get button component source
{
  "tool": "get_component",
  "arguments": { "componentName": "button" }
}

// List all components
{
  "tool": "list_components",
  "arguments": {}
}

// Get dashboard block
{
  "tool": "get_block", 
  "arguments": { "blockName": "dashboard-01" }
}
```

## 🐛 Troubleshooting

### Common Issues

**"Rate limit exceeded" errors:**
```bash
# Solution: Add GitHub API token
npx shadcn-svelte-mcp-server --github-api-key ghp_your_token_here
```

**"Command not found" errors:**
```bash
# Solution: Install Node.js 18+ and ensure npx is available
node --version  # Should be 18+
npx --version   # Should work
```

**Component not found:**
```bash
# Check available components first
npx shadcn-svelte-mcp-server
# Then call list_components tool via your MCP client
```

**Network/proxy issues:**
```bash
# Set proxy if needed
export HTTP_PROXY=http://your-proxy:8080
export HTTPS_PROXY=http://your-proxy:8080
npx shadcn-svelte-mcp-server
```

**Editor not recognizing MCP server:**
```bash
# Verify the server is running
npx shadcn-svelte-mcp-server --help

# Check your editor's MCP configuration
# Ensure the command and args are correct
```

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment variable
DEBUG=* npx shadcn-svelte-mcp-server --github-api-key ghp_your_token
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 🐛 [Report Issues](https://github.com/mudiageo/shadcn-svelte-mcp-server/issues)
- 💬 [Discussions](https://github.com/mudiageo/shadcn-svelte-mcp-server/discussions)
- 📖 [Documentation](https://github.com/mudiageo/shadcn-svelte-mcp-server#readme)

## 🔗 Related Projects

- [shadcn-svelte](https://www.shadcn-svelte.com/) - The Svelte component library this server provides access to
- [shadcn/ui](https://ui.shadcn.com/) - The original React component library
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official MCP SDK

## ⭐ Acknowledgments

- [huntabyte](https://github.com/huntabyte) and the shadcn-svelte team for the amazing Svelte UI component library
- [Janardhan Polle](https://github.com/Jpisnice) for the original shadcn-ui MCP server that this project is based on
- [shadcn](https://github.com/shadcn) for the original UI component library concept
- [Anthropic](https://anthropic.com) for the Model Context Protocol specification
- The open source community for inspiration and contributions

---

**Made with ❤️ for the Svelte community**

**Star ⭐ this repo if you find it helpful!**
```

This updated README:

1. **Acknowledges the original project**: Clearly states it's forked from Jpisnice/shadcn-ui-mcp-server with proper attribution
2. **Adapts content for shadcn-svelte**: Updates all references from shadcn/ui to shadcn-svelte throughout
3. **Maintains the original format**: Follows the exact same structure and style as the original README
4. **Updates package references**: Changes npm package references to use the correct package name `shadcn-svelte-mcp-server`
5. **Credits appropriately**: Acknowledges the original author, shadcn-svelte team, and shadcn in the acknowledgments section
6. **Updates repository links**: Points to your repository for issues, discussions, and documentation


**Made with ❤️ by [Janardhan Polle](https://github.com/Jpisnice)**

**Star ⭐ this repo if you find it helpful!**