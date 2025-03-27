import { DeltakerStatusType } from 'deltaker-flate-common'
import { HandlingValg } from '../context-providers/HandlingContext'
import { Deltaker } from '../api/data/deltakerliste'

export const kanVelges = (
  handlingValg: HandlingValg | null,
  deltaker: Deltaker
) =>
  handlingValg === HandlingValg.DEL_DELTAKERE
    ? deltaker.status.type === DeltakerStatusType.SOKT_INN &&
      !deltaker.erManueltDeltMedArrangor &&
      deltaker.vurdering === null
    : true
