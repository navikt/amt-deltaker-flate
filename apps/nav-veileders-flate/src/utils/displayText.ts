import { DeltakerStatusAarsakType } from 'deltaker-flate-common'
import { PameldingResponse } from '../api/data/pamelding.ts'

export const getDeltakerNavn = (pamelding: PameldingResponse) => {
  return `${pamelding.fornavn} ${pamelding.mellomnavn ? pamelding.mellomnavn + ' ' : ''}${pamelding.etternavn}`
}

export const getDeltakerStatusAarsakTypeText = (
  type: DeltakerStatusAarsakType
) => {
  switch (type) {
    case DeltakerStatusAarsakType.ANNET:
      return 'Annet - fyll ut'
    case DeltakerStatusAarsakType.FATT_JOBB:
      return 'Fått jobb'
    case DeltakerStatusAarsakType.IKKE_MOTT:
      return 'Møter ikke opp'
    case DeltakerStatusAarsakType.SYK:
      return 'Syk'
    case DeltakerStatusAarsakType.TRENGER_ANNEN_STOTTE:
      return 'Trenger annen hjelp og støtte'
    case DeltakerStatusAarsakType.UTDANNING:
      return 'Utdanning'
    case DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT:
      return 'Samarbeidet med arrangøren er avbrutt'
  }
}

export const getEndrePameldingTekst = (digitalBruker: boolean) =>
  digitalBruker
    ? 'Bruker får beskjed på nav.no. Arrangør ser endringen i Deltakeroversikten.'
    : 'Endringen sendes til bruker på papir. Flere endringer innenfor en halvtime sendes samlet. Arrangør ser endringen i Deltakeroversikten.'
