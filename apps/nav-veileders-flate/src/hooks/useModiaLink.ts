export const DELTAKELSESOVERSIKT_LINK = '/arbeidsmarkedstiltak'
export const TILTAKSGJENNOMFORING_LINK = '/arbeidsmarkedstiltak/tiltak'

const queryHeading = (heading: string) =>
  `success_feedback_heading=${encodeURIComponent(heading)}`
const queryBody = (body: string) =>
  `success_feedback_body=${encodeURIComponent(body)}`

const queryParams = (heading: string, body: string) =>
  `?${queryHeading(heading)}&${queryBody(body)}`

interface UseModiaLink {
  doRedirect: (path: string, message?: SuccessMessage) => void
}

interface SuccessMessage {
  heading: string
  body: string
}

export const useModiaLink = (): UseModiaLink => {
  const doRedirect = (path: string, message?: SuccessMessage) => {
    window.history.pushState(
      null,
      '',
      `${path}${message ? queryParams(message.heading, message.body) : ''}`
    )
    window.dispatchEvent(new CustomEvent('veilarbpersonflate.navigate'))
  }

  return { doRedirect }
}
