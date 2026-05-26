import { BodyShort } from '@navikt/ds-react'
import { useState } from 'react'
import { delDeltakereMedArrangor } from '../../api/api'
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

export const DelMedArrangorModal = ({ open, onClose, onSend }: Props) => {
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
    return delDeltakereMedArrangor(
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
          HandlingValg.DEL_DELTAKERE
        )
        if (feiledeDeltakere.length > 0) {
          setHandlingFeiletText(infoTekst)
        } else {
          setHandlingUtfortText(infoTekst)
        }
      })
      .catch(() => {
        setError('Kunne ikke dele med arrangør. Vennligst prøv igjen.')
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
        {`${valgteDeltakere.length} person${valgteDeltakere.length === 1 ? '' : 'er'} deles med arrangør for vurdering. Disse blir synlige i Deltakeroversikten til arrangør.`}
      </BodyShort>
      <BodyShort className="mb-4 mt-4">
        Informasjon om at opplysninger er delt med arrangør, blir synlig for
        deltakerne på nav.no, og for deres Nav-veiledere i Modia.
      </BodyShort>
    </HandlingModal>
  )
}
