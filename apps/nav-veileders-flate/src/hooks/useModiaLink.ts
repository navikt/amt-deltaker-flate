export const DELTAKELSESOVERSIKT_LINK = '/arbeidsmarkedstiltak'
export const TILTAKSGJENNOMFORING_LINK = '/arbeidsmarkedstiltak/tiltak'

interface UseModiaLink {
  doRedirect: (path: string) => void
}

export const useModiaLink = (): UseModiaLink => {
  const doRedirect = (path: string) => {
    window.history.pushState(null, '', path)
    window.dispatchEvent(new CustomEvent('veilarbpersonflate.navigate'))
  }

  return { doRedirect }
}
