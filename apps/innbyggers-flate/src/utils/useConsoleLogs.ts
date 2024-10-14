// Save references to the original console methods
const originalConsole = {
  error: console.error,
  warn: console.warn
}

// Function to format log messages
function formatLogMessage(
  level: 'error' | 'warn',
  message: string,
  ...optionalParams: unknown[]
) {
  const formattedMessage = `AMT_LOG: ${level.toUpperCase()} - ${message}`

  // Return formatted message to the console
  return [formattedMessage, ...optionalParams]
}

console.error = (message, ...optionalParams) => {
  originalConsole.error(
    ...formatLogMessage('error', message, ...optionalParams)
  )
}

console.warn = (message, ...optionalParams) => {
  originalConsole.warn(...formatLogMessage('warn', message, ...optionalParams))
}
