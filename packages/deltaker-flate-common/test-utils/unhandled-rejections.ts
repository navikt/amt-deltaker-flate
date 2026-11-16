interface ProcessWithUnhandledRejection {
  on(event: 'unhandledRejection', listener: (reason: unknown) => void): void
  off(event: 'unhandledRejection', listener: (reason: unknown) => void): void
}

const nodeProcess = (
  globalThis as typeof globalThis & { process: ProcessWithUnhandledRejection }
).process

export const trackUnhandledRejections = () => {
  const rejections: unknown[] = []
  const listener = (reason: unknown) => {
    rejections.push(reason)
  }

  // Node-eventet fanger avvisninger som JSDOM ikke alltid sender til window.
  nodeProcess.on('unhandledRejection', listener)

  return {
    rejections,
    stop: () => nodeProcess.off('unhandledRejection', listener)
  }
}
