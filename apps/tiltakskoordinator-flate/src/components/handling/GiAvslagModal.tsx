import { useState } from 'react'
import { HandlingModal } from './HandlingModal'
import { BodyShort } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useHandlingContext } from '../../context-providers/HandlingContext'
import { lagDeltakerNavn2 } from '../../utils/utils'
import {
  AarsakRadioGroup,
  avslagAarsaker,
  BegrunnelseInput,
  useAarsak,
  useBegrunnelse
} from 'deltaker-flate-common'
import { Deltaker } from '../../api/data/deltakerliste'
import { giAvslag, tildelPlass } from '../../api/api'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export function GiAvslagModal({ open, onClose, onSend }: Props) {
  const { deltakerlisteDetaljer, setDeltakere } = useDeltakerlisteContext()
  const { valgteDeltakere, handlingValg, setHandlingUtfortText } =
    useHandlingContext()

  const aarsak = useAarsak(null)
  const begrunnelse = useBegrunnelse(true)

  const [error, setError] = useState<string | null>(null)

  if (!handlingValg || !open || valgteDeltakere.length === 0) {
    return null
  }

  const deltaker: Deltaker = valgteDeltakere[0]

  const utforHandling = () => {
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
      .then((oppdaterDeltaker: Deltaker) => {
        setDeltakere((prev) =>
          prev.map((d) => (d.id === oppdaterDeltaker.id ? oppdaterDeltaker : d))
        )
        setError(null)
        onSend()

        setHandlingUtfortText(`${lagDeltakerNavn2(deltaker)} ble gitt avslag.`)
      })
      .catch(() => {
        setError('Kunne ikke gi avslag. Vennligst prøv igjen.')
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
        {`${lagDeltakerNavn2(deltaker)} 
					settes som “Ikke aktuell” for ${deltakerlisteDetaljer.navn}. 
					Informasjon om avslag sendes automatisk til deltakerne når du trykker “Gi avslag”.`}
      </BodyShort>
      <BodyShort className="mt-4 mb-4">
        Nav-veileder får beskjed om at deltakeren har fått avslag gjennom Modia.
      </BodyShort>

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
