import { BodyShort } from '@navikt/ds-react'
import { useState } from 'react'
import { tildelPlass } from '../../api/api'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { useInvaliderDeltakere } from '../../hooks/useInvaliderDeltakere'
import { HandlingModal } from './HandlingModal'
import { lagInfoTekst } from './text-utils.ts'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export const TildelPlassModal = ({ open, onClose, onSend }: Props) => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const invaliderDeltakere = useInvaliderDeltakere()
  const {
    valgteDeltakere,
    handlingValg,
    setHandlingUtfortText,
    setHandlingFeiletText
  } = useHandlingContext()

  const [error, setError] = useState<string | null>(null)

  if (!handlingValg) {
    return null
  }

  const onModalClose = () => {
    onClose()
    setError(null)
  }

  const utforHandling = async () => {
    setError(null)
    return tildelPlass(
      deltakerlisteDetaljer.id,
      valgteDeltakere.map((it) => it.id)
    )
      .then(async (deltakereResult) => {
        const feiledeDeltakere = deltakereResult.filter(
          (deltaker) => deltaker.feilkode !== null
        )
        void invaliderDeltakere()
        onSend()

        const infoTekst = lagInfoTekst(
          deltakereResult,
          HandlingValg.TILDEL_PLASS
        )
        if (feiledeDeltakere.length > 0) {
          setHandlingFeiletText(infoTekst)
        } else {
          setHandlingUtfortText(infoTekst)
        }
      })
      .catch(() => {
        setError('Kunne ikke tildele plass. Vennligst prøv igjen.')
      })
  }

  return (
    <HandlingModal
      open={open}
      onClose={onModalClose}
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
        Arrangør kan se deltakerne i Deltakeroversikten.
      </BodyShort>
    </HandlingModal>
  )
}
