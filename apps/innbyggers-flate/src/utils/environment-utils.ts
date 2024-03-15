export enum EndpointHandler {
  MOCK = 'MOCK', // Brukes for demo
  PROXY = 'PROXY' // brukes for lokal kjøring
}

const isDev = (): boolean => {
  return window.location.hostname.includes('intern.dev.nav.no')
}

export const deltakerBffApiBasePath = (): string => {
  const endpointHandlerType = import.meta.env.VITE_ENDPOINT_HANDLER

  if (endpointHandlerType === EndpointHandler.MOCK) {
    return `${import.meta.env.BASE_URL}mock`
  } else if (endpointHandlerType === EndpointHandler.PROXY) {
    return 'http://localhost:58080'
  } else if (isDev()) {
    return '/amt-deltaker-bff'
  } else return 'PROD_LINK'
}

export const useMock = import.meta.env.VITE_ENDPOINT_HANDLER === EndpointHandler.MOCK
/**
 * Returnerer true hvis env er lokalt, demo-app eller pr-deploy.
 * Satt ved: NODE_ENV=development
 */
export const isEnvLocalDemoOrPr = import.meta.env.DEV
