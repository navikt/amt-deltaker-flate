import { util } from 'zod'
import { DeltakerStatusAarsakType } from '../model/deltaker.ts'
import { EndreDeltakelseType } from '../model/endre-deltaker.ts'
import {
  Forslag,
  ForslagEndringAarsak,
  ForslagEndringAarsakType,
  ForslagEndringType
} from '../model/forslag.ts'
import assertNever = util.assertNever

export const getDeltakerStatusAarsak = (aarsak: ForslagEndringAarsak) => {
  switch (aarsak.type) {
    case ForslagEndringAarsakType.Annet:
      return DeltakerStatusAarsakType.ANNET
    case ForslagEndringAarsakType.FattJobb:
      return DeltakerStatusAarsakType.FATT_JOBB
    case ForslagEndringAarsakType.IkkeMott:
      return DeltakerStatusAarsakType.IKKE_MOTT
    case ForslagEndringAarsakType.Syk:
      return DeltakerStatusAarsakType.SYK
    case ForslagEndringAarsakType.TrengerAnnenStotte:
      return DeltakerStatusAarsakType.TRENGER_ANNEN_STOTTE
    case ForslagEndringAarsakType.Utdanning:
      return DeltakerStatusAarsakType.UTDANNING
  }
}

export const getEndreDeltakelsesType = (forslag: Forslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.IkkeAktuell:
      return EndreDeltakelseType.IKKE_AKTUELL
    case ForslagEndringType.AvsluttDeltakelse:
      return EndreDeltakelseType.AVSLUTT_DELTAKELSE
    case ForslagEndringType.ForlengDeltakelse:
      return EndreDeltakelseType.FORLENG_DELTAKELSE
    case ForslagEndringType.Deltakelsesmengde:
      return EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE
    case ForslagEndringType.Sluttdato:
      return EndreDeltakelseType.ENDRE_SLUTTDATO
    case ForslagEndringType.Startdato:
      return EndreDeltakelseType.ENDRE_OPPSTARTSDATO
    case ForslagEndringType.Sluttarsak:
      return EndreDeltakelseType.ENDRE_SLUTTARSAK
    default:
      assertNever(forslag.endring)
  }
}
