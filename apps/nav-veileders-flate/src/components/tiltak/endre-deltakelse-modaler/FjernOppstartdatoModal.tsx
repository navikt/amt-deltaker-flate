import {
  BegrunnelseInput,
  DeltakerStatusType,
  EndreDeltakelseType,
  Forslag,
  getDeltakerStatusDisplayText,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseFjernOppstartsdato } from '../../../api/api.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'

import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface FjernOppstartsdatoModalProps {
  deltaker: DeltakerResponse
  forslag: Forslag | null
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

export const FjernOppstartsdatoModal = ({
  deltaker,
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
      validerDeltakerKanEndres(deltaker)
      if (deltaker.status.type !== DeltakerStatusType.VENTER_PA_OPPSTART) {
        throw new Error(
          `Kan ikke fjerne oppstartsdato for deltaker med status ${getDeltakerStatusDisplayText(deltaker.status.type)}.`
        )
      }
      if (!deltaker.startdato) {
        throw new Error(
          'Kan ikke fjerne oppstartsdato for deltaker som ikke har oppstartsdato.'
        )
      }

      return {
        deltakerId: deltaker.deltakerId,
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
      deltaker={deltaker}
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
        disabled={!deltaker.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}
