import { BodyShort } from '@navikt/ds-react'
import { useState } from 'react'
import { settDeltakerePaVenteliste } from '../../api/api'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useHandlingContext } from '../../context-providers/HandlingContext'
import { HandlingModal } from './HandlingModal'
import { getDeltakereOppdatert } from '../../utils/utils'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export const SettPaVentelisteModal = ({ open, onClose, onSend }: Props) => {
  const { deltakerlisteDetaljer, setDelakere } = useDeltakerlisteContext()
  const { valgteDeltakere, handlingValg, setHandlingUtfortText } =
    useHandlingContext()

  const [error, setError] = useState<string | null>(null)

  if (!handlingValg) {
    return null
  }

  const utforHandling = () => {
    settDeltakerePaVenteliste(
      deltakerlisteDetaljer.id,
      valgteDeltakere.map((it) => it.id)
    )
      .then((oppdaterteDeltakere) => {
        setDelakere((deltakere) =>
          getDeltakereOppdatert(deltakere, oppdaterteDeltakere)
        )
        setError(null)
        onSend()

        setHandlingUtfortText(
          `${valgteDeltakere.length} deltaker${valgteDeltakere.length === 1 ? '' : 'e'} ble satt på venteliste.`
        )
      })
      .catch(() => {
        setError('Kunne ikke sette på venteliste. Vennligst prøv igjen.')
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
        {`${valgteDeltakere.length} person${valgteDeltakere.length === 1 ? '' : 'er'} settes på venteliste.`}
      </BodyShort>
      <BodyShort className="mt-4">
        Informasjon om venteliste-plass sendes automatisk til deltakerne når du
        trykker “Sett på venteliste”.
      </BodyShort>
      <BodyShort className="mt-4 mb-4">
        Arrangør kan se deltakerne på venteliste i Deltakeroversikten.
        Nav-veileder får beskjed om at sine deltakere har fått venteliste-plass
        gjennom Modia.
      </BodyShort>
    </HandlingModal>
  )
}
