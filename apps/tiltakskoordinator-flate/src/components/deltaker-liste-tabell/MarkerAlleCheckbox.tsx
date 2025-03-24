import { Checkbox } from '@navikt/ds-react'
import { Deltaker } from '../../api/data/deltakerliste.ts'
import { useHandlingContext } from '../../context-providers/HandlingContext.tsx'

interface Props {
  valgbareDeltakere: Deltaker[]
}

export const MarkerAlleCheckbox = ({ valgbareDeltakere }: Props) => {
  const { valgteDeltakere, setValgteDeltakere } = useHandlingContext()

  return (
    <Checkbox
      hideLabel
      checked={
        valgteDeltakere.length === valgbareDeltakere.length &&
        valgteDeltakere.length > 0
      }
      indeterminate={
        valgteDeltakere.length > 0 &&
        valgteDeltakere.length !== valgbareDeltakere.length
      }
      onChange={() => {
        if (
          (valgteDeltakere.length > 0 &&
            valgteDeltakere.length !== valgbareDeltakere.length) ||
          valgteDeltakere.length === valgbareDeltakere.length
        ) {
          setValgteDeltakere([])
        } else {
          setValgteDeltakere(valgbareDeltakere)
        }
      }}
    >
      Velg alle rader
    </Checkbox>
  )
}
