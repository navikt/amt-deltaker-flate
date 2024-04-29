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
  return (
    window.location.hostname.includes('intern.dev.nav.no') ||
    window.location.hostname.includes('ansatt.dev.nav.no')
  )
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

export const isPrEnv = import.meta.env.VITE_PR_ENV === 'pull_request'

/** Returnerer true hvis appen kjører lokalt. Blir satt av vite */
export const isLocalEnv = import.meta.env.DEV

export const isEnvLocalDemoOrPr = useMock || isPrEnv

export const getDialogUrl = () => {
  return isDev() || isLocalEnv
    ? 'https://veilarbpersonflate.intern.dev.nav.no/dialog'
    : '#' // TODO legge til dialogmelding url for prod
}
