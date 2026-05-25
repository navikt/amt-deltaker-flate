import { BodyShort } from '@navikt/ds-react'
import { useState } from 'react'
import { settDeltakerePaVenteliste } from '../../api/api'
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

export const SettPaVentelisteModal = ({ open, onClose, onSend }: Props) => {
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
    return settDeltakerePaVenteliste(
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
          HandlingValg.SETT_PA_VENTELISTE
        )
        if (feiledeDeltakere.length > 0) {
          setHandlingFeiletText(infoTekst)
        } else {
          setHandlingUtfortText(infoTekst)
        }
      })
      .catch(() => {
        setError('Kunne ikke sette på venteliste. Vennligst prøv igjen.')
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
        {`${valgteDeltakere.length} person${valgteDeltakere.length === 1 ? '' : 'er'} settes på venteliste.`}
      </BodyShort>
      <BodyShort className="mt-4">
        Informasjon om venteliste-plass sendes automatisk til deltakerne når du
        trykker “Sett på venteliste”.
      </BodyShort>
    </HandlingModal>
  )
}
