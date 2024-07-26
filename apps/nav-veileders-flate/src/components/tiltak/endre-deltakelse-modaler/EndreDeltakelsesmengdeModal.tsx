import {
  AktivtForslag,
  DeltakelsesmengdeForslag,
  EndreDeltakelseType,
  ForslagEndring,
  ForslagEndringType
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { dagerPerUkeFeilmelding } from '../../../model/PameldingFormValues.ts'
import { NumberTextField } from '../../NumberTextField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { EndreDeltakelsesmengdeRequest } from '../../../api/data/endre-deltakelse-request.ts'

interface EndreDeltakelsesmengdeModalProps {
  pamelding: PameldingResponse
  open: boolean
  forslag: AktivtForslag | null
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

  const [deltakelsesprosent, setDeltakelsesprosent] = useState<number | null>(
    defaultMengde.deltakelsesprosent
  )
  const [dagerPerUke, setDagerPerUke] = useState<number | null>(
    defaultMengde.dagerPerUke
  )
  const [hasErrorDeltakelsesprosent, setHasErrorDeltakelsesprosent] =
    useState<boolean>(false)
  const [hasErrorDagerPerUke, setHasErrorDagerPerUke] = useState<boolean>(false)

  const erBegrunnelseValgfri =
    forslag !== null &&
    defaultMengde.deltakelsesprosent === deltakelsesprosent &&
    defaultMengde.dagerPerUke === dagerPerUke

  const begrunnelse = useBegrunnelse(erBegrunnelseValgfri)
  const { enhetId } = useAppContext()

  const gyldigDeltakelsesprosent =
    deltakelsesprosent !== null &&
    0 < deltakelsesprosent &&
    deltakelsesprosent <= 100

  const gyldigDagerPerUke =
    dagerPerUke !== null ? 0 < dagerPerUke && dagerPerUke <= 5 : true

  const validertRequest = () => {
    if (!gyldigDeltakelsesprosent) {
      setHasErrorDeltakelsesprosent(true)
      return null
    }
    if (!gyldigDagerPerUke) {
      setHasErrorDagerPerUke(true)
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
          setHasErrorDeltakelsesprosent(false)
        }}
        error={
          hasErrorDeltakelsesprosent &&
          !gyldigDeltakelsesprosent &&
          'Deltakelsesprosent må være et helt tall fra 1 til 100'
        }
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
            setHasErrorDagerPerUke(false)
          }}
          error={
            hasErrorDagerPerUke && !gyldigDagerPerUke && dagerPerUkeFeilmelding
          }
          className="[&>input]:w-16 mt-4"
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

function getMengde(deltaker: PameldingResponse, forslag: AktivtForslag | null) {
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
