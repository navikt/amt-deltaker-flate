import { Checkbox } from '@navikt/ds-react'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { Deltaker } from '../../api/data/deltakerliste.ts'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext.tsx'

interface Props {
  deltaker: Deltaker
  labelId: string
}

export const VelgDeltakerCheckbox = ({ deltaker, labelId }: Props) => {
  const { handlingValg, valgteDeltakere, setValgteDeltakere } =
    useHandlingContext()

  const toggleSelectedRow = (deltaker: Deltaker) =>
    setValgteDeltakere((list) =>
      list.find((it) => it.id === deltaker.id)
        ? list.filter((it) => it.id !== deltaker.id)
        : [...list, deltaker]
    )

  const disabled =
    handlingValg === HandlingValg.DEL_DELTAKERE
      ? deltaker.status.type !== DeltakerStatusType.SOKT_INN ||
        deltaker.erManueltDeltMedArrangor ||
        deltaker.vurdering !== null
      : false

  return (
    <Checkbox
      hideLabel
      checked={!!valgteDeltakere.find((it) => it.id === deltaker.id)}
      onChange={() => toggleSelectedRow(deltaker)}
      disabled={disabled}
      aria-labelledby={labelId}
    >
      {' '}
    </Checkbox>
  )
}
