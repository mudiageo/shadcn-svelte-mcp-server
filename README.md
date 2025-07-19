# Shadcn UI v4 MCP Server

A Model Context Protocol (MCP) server for shadcn/ui v4 components, providing AI assistants with access to component source code, demos, blocks, and metadata.

## Features

- **JSON-RPC 2.0 Compliant**: Full compliance with JSON-RPC 2.0 specification
- **MCP SDK 1.16.0**: Latest SDK with enhanced features and performance
- **Structured Logging**: Winston-based logging with correlation IDs and request tracking
- **Error Handling**: Comprehensive error handling with proper error codes and sanitization
- **Circuit Breaker Pattern**: Protection against external API failures
- **Input Validation**: Joi-based parameter validation with detailed error messages
- **Performance Monitoring**: Slow request detection and performance metrics
- **Security**: Data sanitization for sensitive information in logs

## Installation

```bash
npm install shadcn-ui-mcp-server
```

## Usage

### Basic Usage

```bash
npx shadcn-ui-mcp-server
```

### With GitHub API Key

```bash
npx shadcn-ui-mcp-server --github-api-key YOUR_TOKEN
# or
npx shadcn-ui-mcp-server -g YOUR_TOKEN
```

### Environment Variables

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
export LOG_LEVEL=info  # debug, info, warn, error
npx shadcn-ui-mcp-server
```

## MCP SDK 1.16.0 Features

This server utilizes the latest MCP SDK 1.16.0 with the following enhancements:

### Enhanced Type Safety
- Improved TypeScript types for better development experience
- Better error type definitions with more specific error codes
- Enhanced request/response type safety

### Better Error Handling
- More specific error types for different failure scenarios
- Improved error propagation through the request chain
- Better error context in log messages

### Performance Improvements
- Optimized request processing with better memory management
- Enhanced transport handling with improved efficiency
- Better resource management for long-running connections

### Developer Experience
- Better debugging with enhanced error messages
- Improved logging with more context information
- Enhanced documentation and type hints

## JSON-RPC 2.0 Compliance

This server implements full JSON-RPC 2.0 compliance with the following features:

### Error Codes

- **Standard JSON-RPC 2.0 Errors**:
  - `-32700`: Parse error
  - `-32600`: Invalid request
  - `-32601`: Method not found
  - `-32602`: Invalid params
  - `-32603`: Internal error

- **Custom Application Errors**:
  - `-32001`: Resource not found
  - `-32002`: Insufficient permissions
  - `-32003`: Rate limit exceeded
  - `-32004`: Validation error
  - `-32005`: External API error

### Response Format

All responses follow the JSON-RPC 2.0 specification:

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "result": { ... },
  "error": {
    "code": -32602,
    "message": "Invalid parameters",
    "data": { ... }
  }
}
```

## Logging

The server uses structured logging with Winston:

### Log Levels

- `debug`: Detailed debugging information
- `info`: General information about server operations
- `warn`: Warning messages for potential issues
- `error`: Error messages with full stack traces

### Log Events

- `server_startup`: Server initialization
- `transport_initialized`: Transport setup tracking
- `handlers_setup_start`: Handler registration start
- `handlers_setup_complete`: Handler registration completion
- `request_start`: Request processing begins
- `request_success`: Request completed successfully
- `request_error`: Request failed with error details
- `slow_request`: Requests taking longer than threshold
- `tool_error`: Tool execution errors
- `external_api_error`: External API failures

### Correlation IDs

Each request is assigned a unique correlation ID for tracking:

```json
{
  "event": "request_start",
  "correlationId": "uuid-v4",
  "method": "call_tool",
  "requestId": "client-request-id",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "sdkVersion": "1.16.0"
}
```

## Error Handling

### Custom Error Classes

- `McpError`: Base error class with JSON-RPC 2.0 error codes
- `ValidationError`: Input validation failures
- `ResourceNotFoundError`: Requested resource not found
- `ExternalApiError`: External API communication failures

### Error Sanitization

Sensitive data is automatically sanitized in logs:

```typescript
// Input
{ "password": "secret123", "token": "abc123" }

// Logged output
{ "password": "[REDACTED]", "token": "[REDACTED]" }
```

## Circuit Breaker Pattern

The server implements circuit breaker pattern for external API calls:

### States

- **CLOSED**: Normal operation, requests pass through
- **OPEN**: Service unavailable, requests fail fast
- **HALF_OPEN**: Testing if service has recovered

### Configuration

```typescript
{
  failureThreshold: 5,    // Failures before opening circuit
  timeout: 60000,         // Time to wait before half-open
  successThreshold: 2     // Successes to close circuit
}
```

## Input Validation

All input parameters are validated using Joi schemas:

### Validation Schemas

- Component names: String, 1-100 characters
- Search queries: String, 1-500 characters
- Resource URIs: String, 1-1000 characters
- Optional parameters: Properly typed and validated

### Validation Errors

Detailed error messages for validation failures:

```json
{
  "error": {
    "code": -32004,
    "message": "Validation failed: componentName: \"\" is not allowed to be empty"
  }
}
```

## Performance Monitoring

### Slow Request Detection

Requests taking longer than 5 seconds are logged as warnings:

```json
{
  "event": "slow_request",
  "correlationId": "uuid",
  "method": "get_component",
  "duration": 7500,
  "threshold": 5000
}
```

### Request Duration Tracking

All requests are timed and logged:

```json
{
  "event": "request_success",
  "correlationId": "uuid",
  "method": "call_tool",
  "duration": 1250,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Available Tools

### Component Tools

- `get_component`: Get component source code
- `get_component_demo`: Get component demo/example
- `get_component_metadata`: Get component metadata
- `list_components`: List all available components

### Search Tools

- `search_components`: Search for components
- `get_themes`: Get available themes
- `get_blocks`: Get available blocks

### Repository Tools

- `get_directory_structure`: Get repository directory structure
- `get_block`: Get specific block code

## Available Resources

- Static documentation resources
- Component templates
- Usage examples
- Installation guides

## Available Prompts

- Component usage prompts
- Best practices prompts
- Troubleshooting prompts

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

## Production Deployment

### Environment Configuration

```bash
# Production logging
export LOG_LEVEL=warn

# GitHub API token
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token

# Start server
npx shadcn-ui-mcp-server
```

### Log Management

- Log files are automatically rotated (5MB max, 5 files)
- Logs include timestamps and structured data
- Sensitive information is automatically sanitized

### Monitoring

- Monitor log files for errors and warnings
- Track slow request patterns
- Monitor circuit breaker states
- Set up alerts for critical errors

## Error Codes Reference

| Code | Description | Usage |
|------|-------------|-------|
| -32700 | Parse error | Invalid JSON in request |
| -32600 | Invalid request | Malformed request structure |
| -32601 | Method not found | Unknown method called |
| -32602 | Invalid params | Parameter validation failed |
| -32603 | Internal error | Unexpected server error |
| -32001 | Resource not found | Requested resource doesn't exist |
| -32002 | Insufficient permissions | Access denied |
| -32003 | Rate limit exceeded | API rate limit hit |
| -32004 | Validation error | Input validation failed |
| -32005 | External API error | External service failure |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.