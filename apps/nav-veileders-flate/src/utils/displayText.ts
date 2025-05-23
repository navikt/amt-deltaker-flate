import { PameldingResponse } from '../api/data/pamelding.ts'

const hvisForslagTekst =
  '\n\nDersom du ikke ønsker å gjøre endringer i tiltaket, må du avvise forslaget fra tiltaksarrangør øverst i skjemaet.'

export const getFeilmeldingIngenEndringTekst = (harForslag: boolean) => {
  const feilmelding =
    'Innholdet i skjemaet medfører ingen endringer i deltakelsen på tiltaket.\nFor å lagre må du endre på beskrivelsen.'
  return harForslag ? `${feilmelding}${hvisForslagTekst}` : feilmelding
}

export const getFeilmeldingIngenEndring = (harForslag: boolean) => {
  const feilmelding =
    'Innholdet i skjemaet medfører ingen endringer i deltakelsen på tiltaket.\nFor å lagre må minst ett felt i skjemaet være ulikt nåværende deltakelse.'
  return harForslag ? `${feilmelding}${hvisForslagTekst}` : feilmelding
}

export const FEILMELDING_15_DAGER_SIDEN =
  'Det er mer enn 15 dager siden statusen ble “Deltar”, og du kan ikke lenger lagre denne endringen. Du må derfor avvise forslaget.'

export const getDeltakerNavn = (pamelding: PameldingResponse) => {
  return `${pamelding.fornavn} ${pamelding.mellomnavn ? pamelding.mellomnavn + ' ' : ''}${pamelding.etternavn}`
}

export const getEndrePameldingTekst = (deltaker: PameldingResponse) => {
  return deltaker.digitalBruker
    ? 'Bruker får beskjed på nav.no og kan se innholdet i begrunnelsen.'
    : 'Endringen sendes til bruker på papir. Flere endringer innenfor en halvtime sendes samlet.'
}
