import { Alert, BodyShort } from '@navikt/ds-react'
import {
  AarsakRadioGroup,
  avslagAarsaker,
  BegrunnelseInput,
  useAarsak,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { giAvslag } from '../../api/api'
import { Deltaker } from '../../api/data/deltakerliste'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useHandlingContext } from '../../context-providers/HandlingContext'
import { useInvaliderDeltakere } from '../../hooks/useInvaliderDeltakere'
import { lagDeltakerNavn } from '../../utils/utils'
import { HandlingModal } from './HandlingModal'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export const GiAvslagModal = ({ open, onClose, onSend }: Props) => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const invaliderDeltakere = useInvaliderDeltakere()
  const { valgteDeltakere, handlingValg, setHandlingUtfortText } =
    useHandlingContext()

  const aarsak = useAarsak(null)
  const begrunnelse = useBegrunnelse(true)

  const [error, setError] = useState<string | null>(null)

  // Denne modalen håndterer kun én deltaker om gangen
  if (!handlingValg || !open || valgteDeltakere.length === 0) {
    return null
  }

  const deltaker: Deltaker = valgteDeltakere[0]

  const onModalClose = () => {
    onClose()
    setError(null)
  }

  const utforHandling = async () => {
    setError(null)

    if (
      !aarsak.valider() ||
      aarsak.aarsak === undefined ||
      !begrunnelse.valider()
    ) {
      setError('Vennligst fiks de øvrige feilene.')
      return
    }

    return giAvslag(
      deltakerlisteDetaljer.id,
      deltaker.id,
      {
        type: aarsak.aarsak,
        beskrivelse: aarsak.beskrivelse ?? null
      },
      begrunnelse.begrunnelse
    )
      .then(async () => {
        void invaliderDeltakere()
        setHandlingUtfortText(`${lagDeltakerNavn(deltaker)} fikk avslag.`)
        onSend()
      })
      .catch((e) => {
        console.error(e)
        setError('Kunne ikke gi avslag. Vennligst prøv igjen.')
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
        {`${lagDeltakerNavn(deltaker)} settes som “Ikke aktuell” for ${deltakerlisteDetaljer.navn}.`}
      </BodyShort>

      <Alert variant="info" size="small" className="mt-5 mb-6">
        Bruker får beskjed om avslaget og kan se innholdet i begrunnelsen.
      </Alert>

      <AarsakRadioGroup
        velgbareAarsaker={avslagAarsaker}
        aarsak={aarsak.aarsak}
        aarsakError={aarsak.aarsakError}
        beskrivelse={aarsak.beskrivelse}
        beskrivelseError={aarsak.beskrivelseError}
        legend={'Hva er årsaken til at deltakeren får avslag?'}
        onChange={aarsak.handleChange}
        onBeskrivelse={aarsak.handleBeskrivelse}
      />

      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={false}
      />
    </HandlingModal>
  )
}
