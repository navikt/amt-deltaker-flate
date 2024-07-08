import { DeltakerStatusAarsakType } from '../model/deltaker.ts'
import {
  ForslagEndringAarsak,
  ForslagEndringAarsakType
} from '../model/forslag.ts'

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
