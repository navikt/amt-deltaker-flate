import { BodyShort } from '@navikt/ds-react'
import { useState } from 'react'
import { delDeltakereMedArrangor } from '../../api/api'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useHandlingContext } from '../../context-providers/HandlingContext'
import { HandlingModal } from './HandlingModal'
import { getDeltakereOppdatert } from '../../utils/utils'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export const DelMedArrangorModal = ({ open, onClose, onSend }: Props) => {
  const { deltakerlisteDetaljer, setDeltakere } = useDeltakerlisteContext()
  const { valgteDeltakere, handlingValg, setHandlingUtfortText } =
    useHandlingContext()

  const [error, setError] = useState<string | null>(null)

  if (!handlingValg) {
    return null
  }

  const utforHandling = () => {
    return delDeltakereMedArrangor(
      deltakerlisteDetaljer.id,
      valgteDeltakere.map((it) => it.id)
    )
      .then((oppdaterteDeltakere) => {
        setDeltakere((deltakere) =>
          getDeltakereOppdatert(deltakere, oppdaterteDeltakere)
        )
        setError(null)
        onSend()

        setHandlingUtfortText(
          `${valgteDeltakere.length} deltaker${valgteDeltakere.length === 1 ? '' : 'e'} ble delt med arrangør.`
        )
      })
      .catch(() => {
        setError('Kunne ikke dele med arrangør. Vennligst prøv igjen.')
      })
  }

  return (
    <HandlingModal
      open={open}
      onClose={onClose}
      onUtforHandling={utforHandling}
      error={error}
    >
      <BodyShort>
        {`${valgteDeltakere.length} person${valgteDeltakere.length === 1 ? '' : 'er'} deles med arrangør for vurdering. Disse blir synlige i Deltakeroversikten til arrangør.`}
      </BodyShort>
      <BodyShort className="mb-4 mt-4">
        Informasjon om at opplysninger er delt med arrangør, blir synlig for
        deltakerne på nav.no, og for deres Nav-veiledere i Modia.
      </BodyShort>
    </HandlingModal>
  )
}
