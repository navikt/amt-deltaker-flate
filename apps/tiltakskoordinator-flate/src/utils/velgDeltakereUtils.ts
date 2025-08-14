import { DeltakerStatusType } from 'deltaker-flate-common'
import { HandlingValg } from '../context-providers/HandlingContext'
import { Deltaker } from '../api/data/deltakerliste'

export const kanVelges = (
  handlingValg: HandlingValg | null,
  deltaker: Deltaker
) => {
  if (!deltaker.kanEndres && handlingValg !== null) {
    return false
  }

  if (handlingValg === HandlingValg.DEL_DELTAKERE) {
    return (
      deltaker.status.type === DeltakerStatusType.SOKT_INN &&
      !deltaker.erManueltDeltMedArrangor &&
      deltaker.vurdering === null
    )
  }

  if (handlingValg === HandlingValg.SETT_PA_VENTELISTE) {
    return deltaker.status.type !== DeltakerStatusType.VENTELISTE
  }

  if (handlingValg === HandlingValg.TILDEL_PLASS) {
    return (
      deltaker.status.type !== DeltakerStatusType.VENTER_PA_OPPSTART &&
      deltaker.status.type !== DeltakerStatusType.DELTAR &&
      deltaker.status.type !== DeltakerStatusType.AVBRUTT &&
      deltaker.status.type !== DeltakerStatusType.FULLFORT
    )
  }

  return true
}
