import {
  BegrunnelseInput,
  EndreDeltakelseType,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { EndreDeltakelsesmengdeRequest } from '../../../api/data/endre-deltakelse-request.ts'
import {
  getDagerPerUkeError,
  getProsentError
} from '../../../utils/deltakelsesmengdeValidering.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { NumberTextField } from '../../NumberTextField.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import {
  DagerPerUkeField,
  GyldigFraField
} from './EndreDeltakelsesmengdeFelter.tsx'
import {
  EndreDeltakelsesmengdeModalProps,
  getMengde,
  harEndringSidenSisteDeltakelsesmengde,
  lagFellesDeltakelsesmengdeBodyFelter
} from './EndreDeltakelsesmengdeFelles.ts'

export const EndreDeltakelsesmengdeGruppeModal = ({
  deltaker,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreDeltakelsesmengdeModalProps) => {
  const defaultMengde = getMengde(deltaker, forslag)
  const { enhetId } = useAppContext()

  const [deltakelsesprosent, setDeltakelsesprosent] = useState<number | null>(
    defaultMengde.deltakelsesprosent
  )
  const [dagerPerUke, setDagerPerUke] = useState<number | null>(
    defaultMengde.dagerPerUke
  )
  const [gyldigFra, setGyldigFra] = useState<Date | undefined>(
    defaultMengde.gyldigFra
  )

  const [deltakelsesprosentError, setDeltakelsesprosentError] =
    useState<string>()
  const [dagerPerUkeError, setDagerPerUkeError] = useState<string>()
  const [gyldigFraError, setGyldigFraError] = useState<string>()

  const erBegrunnelseValgfri =
    forslag !== null &&
    defaultMengde.deltakelsesprosent === deltakelsesprosent &&
    defaultMengde.dagerPerUke === dagerPerUke

  const begrunnelse = useBegrunnelse(erBegrunnelseValgfri)

  const validerDeltakelsesMengde = (
    prosent: number | null,
    antallDagerPerUke: number | null
  ) => {
    const errorProsent = getProsentError(prosent)
    const errorDager = getDagerPerUkeError({
      deltakelsesprosent: prosent,
      dagerPerUke: antallDagerPerUke,
      maxDagerPerUke: 5
    })
    setDeltakelsesprosentError(errorProsent)
    setDagerPerUkeError(errorDager)
    return !errorDager && !errorProsent
  }

  const validertRequest = () => {
    if (!deltakelsesprosent) {
      return null
    }

    if (
      deltakelsesprosentError ||
      dagerPerUkeError ||
      gyldigFraError ||
      !validerDeltakelsesMengde(deltakelsesprosent, dagerPerUke)
    ) {
      return null
    }

    if (!begrunnelse.valider()) {
      return null
    }

    if (gyldigFra === undefined) {
      return null
    }

    if (
      !harEndringSidenSisteDeltakelsesmengde(deltaker, gyldigFra, (siste) => {
        return (
          deltakelsesprosent !== siste.deltakelsesprosent ||
          dagerPerUke !== siste.dagerPerUke
        )
      })
    ) {
      throw new Error(getFeilmeldingIngenEndring(forslag !== null))
    }

    validerDeltakerKanEndres(deltaker)

    const body: EndreDeltakelsesmengdeRequest = {
      deltakelsesprosent,
      dagerPerUke:
        dagerPerUke != null && deltakelsesprosent !== 100
          ? dagerPerUke
          : undefined,
      ...lagFellesDeltakelsesmengdeBodyFelter(
        gyldigFra,
        begrunnelse.begrunnelse,
        forslag?.id
      )
    }

    return {
      deltakerId: deltaker.deltakerId,
      enhetId,
      body
    }
  }

  const visDagerIUka = deltakelsesprosent && deltakelsesprosent !== 100

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE}
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelsesmengde}
      validertRequest={validertRequest}
      forslag={forslag}
    >
      <NumberTextField
        label="Hva er ny deltakelsesprosent?"
        disabled={!deltaker.erUnderOppfolging}
        value={deltakelsesprosent || undefined}
        onChange={(e) => {
          setDeltakelsesprosent(e || null)
          validerDeltakelsesMengde(e ?? null, dagerPerUke)
        }}
        error={deltakelsesprosentError}
        required
        id="deltakelsesprosent"
        className="[&>input]:w-16 mt-4"
      />
      {visDagerIUka && (
        <DagerPerUkeField
          label="Hvor mange dager i uka? (valgfritt)"
          dagerPerUke={dagerPerUke}
          dagerPerUkeError={dagerPerUkeError}
          disabled={!deltaker.erUnderOppfolging}
          onChange={(e) => {
            setDagerPerUke(e || null)
            validerDeltakelsesMengde(deltakelsesprosent, e ?? null)
          }}
        />
      )}
      <GyldigFraField
        deltaker={deltaker}
        gyldigFra={gyldigFra}
        gyldigFraError={gyldigFraError}
        onValidate={setGyldigFraError}
        onChange={setGyldigFra}
      />
      <BegrunnelseInput
        onChange={begrunnelse.handleChange}
        type={erBegrunnelseValgfri ? 'valgfri' : 'obligatorisk'}
        error={begrunnelse.error}
        disabled={!deltaker.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}
