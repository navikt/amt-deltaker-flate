const isDev = (): boolean => {
  return window.location.hostname.includes('intern.dev.nav.no')
}

export const isPrEvn = import.meta.env.VITE_PR_ENV === 'pull_request'

export const deltakerBffApiBasePath = (): string => {
  if (useMock) {
    return import.meta.env.BASE_URL
  } else if (isPrEvn) {
    return `${import.meta.env.BASE_URL}/amt-deltaker-bff`.replace(
      /\/pr-\d+/,
      ''
    )
  } else if (isDev()) {
    return `${import.meta.env.BASE_URL}/amt-deltaker-bff`
  } else return 'PROD_LINK'
}

export const useMock = import.meta.env.VITE_ENDPOINT_HANDLER === 'MOCK'

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
