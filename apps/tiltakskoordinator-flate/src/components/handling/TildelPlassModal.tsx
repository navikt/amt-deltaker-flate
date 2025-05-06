import { BodyShort } from '@navikt/ds-react'
import { useState } from 'react'
import { tildelPlass } from '../../api/api'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useHandlingContext } from '../../context-providers/HandlingContext'
import { HandlingModal } from './HandlingModal'
import { getDeltakereOppdatert } from '../../utils/utils'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export const TildelPlassModal = ({ open, onClose, onSend }: Props) => {
  const { deltakerlisteDetaljer, setDeltakere } = useDeltakerlisteContext()
  const { valgteDeltakere, handlingValg, setHandlingUtfortText } =
    useHandlingContext()

  const [error, setError] = useState<string | null>(null)

  if (!handlingValg) {
    return null
  }

  const utforHandling = () => {
    return tildelPlass(
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
          `${valgteDeltakere.length} deltaker${valgteDeltakere.length === 1 ? '' : 'e'} ble tildelt plass.`
        )
      })
      .catch(() => {
        setError('Kunne ikke tildele plass. Vennligst prøv igjen.')
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
        {`${valgteDeltakere.length} person${valgteDeltakere.length === 1 ? '' : 'er'} tildeles plass.`}
      </BodyShort>
      <BodyShort className="mt-4">
        Vedtak om plass sendes automatisk til deltakerne når du trykker “Tildel
        plass”.
      </BodyShort>
      <BodyShort className="mt-4 mb-4">
        Arrangør kan se deltakerne i Deltakeroversikten. Nav-veileder får
        beskjed om at sine deltakere har fått plass gjennom Modia.
      </BodyShort>
    </HandlingModal>
  )
}
