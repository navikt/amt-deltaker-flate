export enum EndpointHandler {
  MOCK = 'MOCK',
  PROXY = 'PROXY',
  DEV = 'DEV',
  PROD = 'PROD'
}

export const getEndpointHandlerType = (): EndpointHandler => {
  return import.meta.env.VITE_ENDPOINT_HANDLER || EndpointHandler.PROD
}

const isDev = (): boolean => {
  return window.location.hostname.includes('intern.dev.nav.no')
}

export const deltakerBffApiBasePath = (): string => {
  switch (getEndpointHandlerType()) {
    case EndpointHandler.MOCK:
      return '/mock'
    case EndpointHandler.PROXY:
      return 'http://localhost:58080'
    default:
      if (isDev()) {
        return '/amt-deltaker-bff'
      }

      return 'PROD_LINK'
  }
}

export const useMock = getEndpointHandlerType() === EndpointHandler.MOCK

/** Returnerer true hvis appen kjører lokalt. Blir satt av vite */
export const isLocalEnv = import.meta.env.DEV

/**
 * Returnerer true hvis env er lokalt, demo-app eller pr-deploy.
 */
export const isEnvLocalDemoOrPr =
  useMock || import.meta.env.VITE_MODE === 'pull_request'

export const getDialogUrl = () => {
  return isDev() || isLocalEnv
    ? 'https://veilarbpersonflate.intern.dev.nav.no/dialog'
    : '#' // TODO legge til dialogmelding url for prod
}
