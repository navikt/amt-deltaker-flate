export enum EndpointHandler {
    MOCK = 'MOCK',
    PROXY = 'PROXY',
    DEV = 'DEV',
    PROD = 'PROD'
}

export const getEndpointHandlerType = (): EndpointHandler => {
  return import.meta.env.VITE_ENDPOINT_HANDLER || EndpointHandler.PROD
}

export const deltakerBffApiBasePath = (): string => {
  switch (getEndpointHandlerType()) {
    case EndpointHandler.MOCK:
      return '/mock'
    case EndpointHandler.PROXY:
      return 'http://localhost:58080'
    default:
      if(isDev()) {
        return '/amt-deltaker-bff'
      }

      return 'PROD_LINK'
  }
}

const isDev = (): boolean => {
  return window.location.hostname.includes('intern.dev.nav.no')
}

export const getCurrentMode = () => {
  return import.meta.env.VITE_MODE
}

export const useMock = getEndpointHandlerType() === EndpointHandler.MOCK
/**
 * Returnerer true hvis env er lokalt, demo-app eller pr-deploy.
 */
export const isEnvLocalDemoOrPr = import.meta.env.DEV