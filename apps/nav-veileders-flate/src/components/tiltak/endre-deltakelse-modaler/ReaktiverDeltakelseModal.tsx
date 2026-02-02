import { BodyLong, ConfirmationPanel } from '@navikt/ds-react'
import {
  BegrunnelseInput,
  EndreDeltakelseType,
  kreverGodkjenningForPamelding,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { endreDeltakelseReaktiver } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

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
      validerDeltakerKanEndres(pamelding)
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

  const kreverGodkjenning = kreverGodkjenningForPamelding(
    pamelding.deltakerliste.pameldingstype
  )

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.REAKTIVER_DELTAKELSE}
      deltaker={pamelding}
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
        label={
          kreverGodkjenning
            ? 'Ja, brukeren skal søkes inn likevel'
            : 'Ja, brukeren skal delta likevel'
        }
      >
        <BodyLong size="small">
          {kreverGodkjenning
            ? `Skal brukeren søkes inn på tiltaket likevel?
						Statusen settes tilbake til “Søkt inn” og brukeren mottar informasjon om søknaden.`
            : `Skal brukeren delta på tiltaket likevel? Statusen settes tilbake til
						“Venter på oppstart” og brukeren mottar informasjon om påmeldingen.`}
        </BodyLong>
      </ConfirmationPanel>
      <BegrunnelseInput
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={!pamelding.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}
