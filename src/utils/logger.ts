/**
 * Simple console logging wrapper
 * All logging goes to stderr to avoid interfering with JSON-RPC stdout communication
 */

/**
 * Simple error logging function
 */
export function logError(message: string, error?: any): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message} - ${errorMessage}`);
  if (error instanceof Error && error.stack) {
    console.error(`Stack: ${error.stack}`);
  }
}

/**
 * Simple warning logging function
 */
export function logWarning(message: string): void {
  console.warn(`WARN: ${message}`);
}

/**
 * Simple info logging function
 */
export function logInfo(message: string): void {
  console.info(`INFO: ${message}`);
} 