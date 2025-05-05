import {
  DeltakerStatusType,
  EMDASH,
  EndreDeltakelseType,
  Forslag,
  getDeltakerStatusDisplayText
} from 'deltaker-flate-common'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseFjernOppstartsdato } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'

import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

interface FjernOppstartsdatoModalProps {
  pamelding: PameldingResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const FjernOppstartsdatoModal = ({
  pamelding,
  forslag,
  open,
  onClose,
  onSuccess
}: FjernOppstartsdatoModalProps) => {
  const skalHaBegrunnelse = !forslag

  const begrunnelse = useBegrunnelse(!skalHaBegrunnelse)
  const { enhetId } = useAppContext()

  const validertRequest = () => {
    let hasError = false

    if (!begrunnelse.valider()) {
      hasError = true
    }

    if (!hasError) {
      validerDeltakerKanEndres(pamelding)
      if (pamelding.status.type !== DeltakerStatusType.VENTER_PA_OPPSTART) {
        throw new Error(
          `Kan ikke fjerne oppstartsdato for deltaker med status ${getDeltakerStatusDisplayText(pamelding.status.type)}.`
        )
      }
      if (!pamelding.startdato || pamelding.startdato === EMDASH) {
        throw new Error(
          'Kan ikke fjerne oppstartsdato for deltaker som ikke har oppstartsdato.'
        )
      }

      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: {
          begrunnelse: begrunnelse.begrunnelse || null,
          forslagId: forslag ? forslag.id : null
        }
      }
    }
    return null
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.FJERN_OPPSTARTSDATO}
      deltaker={pamelding}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseFjernOppstartsdato}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <BegrunnelseInput
        type={skalHaBegrunnelse ? 'obligatorisk' : 'valgfri'}
        onChange={begrunnelse.handleChange}
        error={begrunnelse.error}
        disabled={!pamelding.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}
