import {
  DeltakelsesmengdeForslag,
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { EndreDeltakelsesmengdeRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import {
  getDagerPerUkeError,
  getProsentError
} from '../../../utils/deltakelsesmengdeValidering.ts'
import { NumberTextField } from '../../NumberTextField.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

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

  const [deltakelsesprosent, setDeltakelsesprosent] = useState<number | null>(
    defaultMengde.deltakelsesprosent
  )
  const [dagerPerUke, setDagerPerUke] = useState<number | null>(
    defaultMengde.dagerPerUke
  )
  const [deltakelsesprosentError, setDeltakelsesprosentError] =
    useState<string>()
  const [dagerPerUkeError, setDagerPerUkeError] = useState<string>()

  const erBegrunnelseValgfri =
    forslag !== null &&
    defaultMengde.deltakelsesprosent === deltakelsesprosent &&
    defaultMengde.dagerPerUke === dagerPerUke

  const begrunnelse = useBegrunnelse(erBegrunnelseValgfri)
  const { enhetId } = useAppContext()

  const validertRequest = () => {
    if (!deltakelsesprosent) {
      return null
    }
    if (
      deltakelsesprosentError ||
      dagerPerUkeError ||
      !validerDeltakelsesMengde(deltakelsesprosent, dagerPerUke)
    ) {
      return null
    }
    if (!begrunnelse.valider()) {
      return null
    }

    const harEndring = !(
      deltakelsesprosent === pamelding.deltakelsesprosent &&
      dagerPerUke === pamelding.dagerPerUke
    )

    const body: EndreDeltakelsesmengdeRequest = {
      deltakelsesprosent: deltakelsesprosent,
      dagerPerUke:
        dagerPerUke != null && deltakelsesprosent !== 100
          ? dagerPerUke
          : undefined,
      begrunnelse: begrunnelse.begrunnelse ?? null,
      forslagId: forslag?.id ?? null
    }
    return {
      deltakerId: pamelding.deltakerId,
      enhetId,
      body,
      harEndring: harEndring
    }
  }

  const handleProsentEndret = (nyProsent: number | undefined) => {
    validerDeltakelsesMengde(nyProsent ?? null, dagerPerUke)
  }
  const handleDagerPerUkeEndret = (nyDager: number | undefined) => {
    validerDeltakelsesMengde(deltakelsesprosent, nyDager ?? null)
  }

  const validerDeltakelsesMengde = (
    prosent: number | null,
    dagerPerUke: number | null
  ) => {
    const errorProsent = getProsentError(prosent)
    const errorDager = getDagerPerUkeError(prosent, dagerPerUke)
    setDeltakelsesprosentError(errorProsent)
    setDagerPerUkeError(errorDager)
    if (errorDager || errorProsent) {
      return false
    }
    return true
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE}
      digitalBruker={pamelding.digitalBruker}
      harAdresse={pamelding.harAdresse}
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
          handleProsentEndret(e)
        }}
        error={deltakelsesprosentError}
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
            handleDagerPerUkeEndret(e)
          }}
          error={dagerPerUkeError}
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
