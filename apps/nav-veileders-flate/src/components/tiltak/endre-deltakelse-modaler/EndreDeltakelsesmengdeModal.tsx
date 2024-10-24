import {
  Forslag,
  DeltakelsesmengdeForslag,
  EndreDeltakelseType,
  ForslagEndring,
  ForslagEndringType
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { NumberTextField } from '../../NumberTextField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { EndreDeltakelsesmengdeRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { useDeltakelsesmengdeValidering } from '../../../utils/deltakelsesmengdeValidering.ts'

interface EndreDeltakelsesmengdeModalProps {
  pamelding: PameldingResponse
  open: boolean
  forslag: Forslag | null
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreDeltakelsesmengdeModal = ({
  pamelding,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreDeltakelsesmengdeModalProps) => {
  const defaultMengde = getMengde(pamelding, forslag)

  const [useDefaultValue, setUseDefaultValue] = useState(true)
  const [deltakelsesprosent, setDeltakelsesprosent] = useState<number | null>(
    defaultMengde.deltakelsesprosent
  )
  const [dagerPerUke, setDagerPerUke] = useState<number | null>(
    defaultMengde.dagerPerUke
  )

  const erBegrunnelseValgfri =
    forslag !== null &&
    defaultMengde.deltakelsesprosent === deltakelsesprosent &&
    defaultMengde.dagerPerUke === dagerPerUke

  const begrunnelse = useBegrunnelse(erBegrunnelseValgfri)
  const { enhetId } = useAppContext()

  const validering = useDeltakelsesmengdeValidering(
    deltakelsesprosent,
    dagerPerUke,
    pamelding.dagerPerUke,
    pamelding.deltakelsesprosent
  )

  const validertRequest = () => {
    if (!deltakelsesprosent) {
      return null
    }
    if (!validering.isValid) {
      setUseDefaultValue(false)
      return null
    }
    if (!begrunnelse.valider()) {
      return null
    }

    const body: EndreDeltakelsesmengdeRequest = {
      deltakelsesprosent: deltakelsesprosent,
      dagerPerUke:
        dagerPerUke != null && deltakelsesprosent !== 100
          ? dagerPerUke
          : undefined,
      begrunnelse: begrunnelse.begrunnelse ?? null,
      forslagId: forslag?.id ?? null
    }
    return { deltakerId: pamelding.deltakerId, enhetId, body }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelsesmengde}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <NumberTextField
        label="Hva er ny deltakelsesprosent?"
        disabled={false}
        value={deltakelsesprosent || undefined}
        onChange={(e) => {
          setDeltakelsesprosent(e || null)
          setUseDefaultValue(false)
        }}
        error={useDefaultValue ? false : validering.deltakelsesprosentError}
        required
        id="deltakelsesprosent"
        className="[&>input]:w-16 mt-4"
      />
      {deltakelsesprosent && deltakelsesprosent != 100 && (
        <NumberTextField
          label="Hvor mange dager i uka? (valgfritt)"
          disabled={false}
          value={dagerPerUke || undefined}
          onChange={(e) => {
            setDagerPerUke(e || null)
            setUseDefaultValue(false)
          }}
          error={useDefaultValue ? false : validering.dagerPerUkeError}
          className="[&>input]:w-16 mt-6"
          id="dagerPerUke"
        />
      )}
      <BegrunnelseInput
        onChange={begrunnelse.handleChange}
        type={erBegrunnelseValgfri ? 'valgfri' : 'obligatorisk'}
        error={begrunnelse.error}
      />
    </Endringsmodal>
  )
}

function isDeltakelsesmengde(
  endring: ForslagEndring
): endring is DeltakelsesmengdeForslag {
  return endring.type === ForslagEndringType.Deltakelsesmengde
}

function getMengde(deltaker: PameldingResponse, forslag: Forslag | null) {
  if (forslag === null)
    return {
      deltakelsesprosent: deltaker.deltakelsesprosent ?? 100,
      dagerPerUke: deltaker.dagerPerUke
    }
  if (isDeltakelsesmengde(forslag.endring)) {
    return {
      deltakelsesprosent: forslag.endring.deltakelsesprosent,
      dagerPerUke: forslag.endring.dagerPerUke
    }
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som deltakelsesmengde`
    )
  }
}
