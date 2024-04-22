export enum EndpointHandler {
  MOCK = 'MOCK', // Brukes for demo og lokalt
  DEV = 'DEV', // Brukes for devmiljø og pull_request deployer
  PROXY = 'PROXY' // brukes for lokal kjøring
}

export const isDev = (): boolean => {
  return window.location.hostname.includes('intern.dev.nav.no')
}

export const isProd = () => {
  return (
    window.location.hostname === 'nav.no' ||
    window.location.hostname === 'www.nav.no'
  )
}

export const isPrEvn = import.meta.env.VITE_PR_ENV === 'pull_request'

export const deltakerBffApiBasePath = (): string => {
  const endpointHandlerType = import.meta.env.VITE_ENDPOINT_HANDLER

  if (endpointHandlerType === EndpointHandler.MOCK) {
    return `${import.meta.env.BASE_URL}mock`
  } else if (endpointHandlerType === EndpointHandler.PROXY) {
    return 'http://localhost:58080'
  } else if (isPrEvn) {
    return `${import.meta.env.BASE_URL}amt-deltaker-bff`.replace(/\/pr-\d+/, '')
  } else if (isDev()) {
    return `${import.meta.env.BASE_URL}amt-deltaker-bff`
  } else return 'PROD_LINK'
}

export const useMock =
  import.meta.env.VITE_ENDPOINT_HANDLER === EndpointHandler.MOCK

export const getDialogUrl = () => {
  return isDev() || import.meta.env.DEV // er devmiljø eller kjører lokalt
    ? 'https://pto.ekstern.dev.nav.no/arbeid/dialog'
    : 'https://www.nav.no/arbeid/dialog'
}

export const getAktivitetsplanUrl = () => {
  return isDev() || import.meta.env.DEV // er devmiljø eller kjører lokalt
    ? 'https://aktivitetsplan.ekstern.dev.nav.no/'
    : 'https://aktivitetsplan.nav.no/'
}

export const PERSONOPPLYSNINGER_URL = 'http://nav.no/person/personopplysninger/'
