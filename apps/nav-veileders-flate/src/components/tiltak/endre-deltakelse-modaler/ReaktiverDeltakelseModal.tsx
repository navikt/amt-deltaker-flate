import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { useState } from 'react'
import { EndreDeltakelseType } from 'deltaker-flate-common'
import { endreDeltakelseReaktiver } from '../../../api/api.ts'
import { BodyLong, ConfirmationPanel } from '@navikt/ds-react'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'

interface ReaktiverDeltakelseModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const ReaktiverDeltakelseModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: ReaktiverDeltakelseModalProps) => {
  const { enhetId } = useAppContext()
  const [confirmed, setConfirmed] = useState(false)
  const [errorConfirmed, setErrorConfirmed] = useState<string | null>(null)

  const begrunnelse = useBegrunnelse(false)

  const handleChangeConfirm = () => {
    setConfirmed((oldValue) => !oldValue)
    setErrorConfirmed(null)
  }

  const validertRequest = () => {
    let hasError = false
    if (!confirmed) {
      setErrorConfirmed('Du må bekrefte før du kan fortsette.')
      hasError = true
    }

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (!hasError && confirmed && begrunnelse.begrunnelse) {
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          begrunnelse: begrunnelse.begrunnelse
        }
      }
    }
    return null
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.REAKTIVER_DELTAKELSE}
      digitalBruker={pamelding.digitalBruker}
      harAdresse={pamelding.harAdresse}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseReaktiver}
      validertRequest={validertRequest}
      forslag={null}
    >
      <ConfirmationPanel
        size="small"
        checked={confirmed}
        onChange={handleChangeConfirm}
        error={errorConfirmed}
        label="Ja, brukeren skal delta likevel"
      >
        <BodyLong size="small">
          Skal brukeren delta på tiltaket likevel? Statusen settes tilbake til
          “venter på oppstart” og brukeren mottar informasjon om påmeldingen.
        </BodyLong>
      </ConfirmationPanel>
      <BegrunnelseInput
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}
