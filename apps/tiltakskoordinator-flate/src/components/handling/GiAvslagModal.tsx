import { useState } from 'react'
import { HandlingModal } from './HandlingModal'
import { BodyShort } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useHandlingContext } from '../../context-providers/HandlingContext'
import { lagDeltakerNavn } from '../../utils/utils'
import { BegrunnelseInput, useBegrunnelse } from 'deltaker-flate-common'

interface Props {
  open: boolean
  onClose: () => void
  onSend: () => void
}

export function GiAvslagModal({ open, onClose, onSend }: Props) {
  const { deltakerlisteDetaljer, setDeltakere } = useDeltakerlisteContext()
  const { valgteDeltakere, handlingValg, setHandlingUtfortText } =
    useHandlingContext()

  const begrunnelse = useBegrunnelse(true)

  const [error, setError] = useState<string | null>(null)

  if (!handlingValg) {
    return null
  }

  if (!open) {
    return null
  }

  const utforHandling = () => {
    return new Promise<void>(() => {})
    /*return tildelPlass(
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
			*/
  }

  return (
    <HandlingModal
      open={open}
      onClose={onClose}
      onUtforHandling={utforHandling}
      error={error}
    >
      <BodyShort>
        {`${lagDeltakerNavn(valgteDeltakere[0].fornavn, valgteDeltakere[0].mellomnavn, valgteDeltakere[0].etternavn)} 
					settes som “Ikke aktuell” for Sveisekurs  hos Muligheter AS. 
					Informasjon om avslag sendes automatisk til deltakerne når du trykker “Gi avslag”.`}
      </BodyShort>
      <BodyShort className="mt-4">
        Nav-veileder får beskjed om at deltakeren har fått avslag gjennom Modia.
      </BodyShort>

      <BegrunnelseInput
        type="valgfri"
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={false}
      />
    </HandlingModal>
  )
}
