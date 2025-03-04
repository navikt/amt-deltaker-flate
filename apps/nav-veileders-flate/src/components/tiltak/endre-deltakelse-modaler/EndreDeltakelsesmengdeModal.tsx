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
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { NumberTextField } from '../../NumberTextField.tsx'
import { BegrunnelseInput, useBegrunnelse } from '../modal/BegrunnelseInput.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import {
  dateStrToNullableDate,
  formatDateToDtoStr
} from '../../../utils/utils.ts'
import dayjs from 'dayjs'

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
  const [gyldigFra, setGyldigFra] = useState<Date | undefined>(
    defaultMengde.gyldigFra
  )

  const [deltakelsesprosentError, setDeltakelsesprosentError] =
    useState<string>()
  const [dagerPerUkeError, setDagerPerUkeError] = useState<string>()
  const [gyldigFraError, setgyldigFraError] = useState<string>()

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

    const harEndring = () => {
      const siste = pamelding.deltakelsesmengder.sisteDeltakelsesmengde
      if (siste === null) {
        return true
      }
      if (
        deltakelsesprosent !== siste.deltakelsesprosent ||
        dagerPerUke !== siste.dagerPerUke
      ) {
        return true
      } else {
        return dayjs(gyldigFra)
          .startOf('day')
          .isBefore(dayjs(siste.gyldigFra).startOf('day'))
      }
    }

    if (!harEndring()) {
      throw new Error(getFeilmeldingIngenEndring(forslag !== null))
    }

    validerDeltakerKanEndres(pamelding)

    const body: EndreDeltakelsesmengdeRequest = {
      deltakelsesprosent: deltakelsesprosent,
      dagerPerUke:
        dagerPerUke != null && deltakelsesprosent !== 100
          ? dagerPerUke
          : undefined,
      gyldigFra: formatDateToDtoStr(gyldigFra),
      begrunnelse: begrunnelse.begrunnelse ?? null,
      forslagId: forslag?.id ?? null
    }
    return {
      deltakerId: pamelding.deltakerId,
      enhetId,
      body
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
      erUnderOppfolging={pamelding.erUnderOppfolging}
    >
      <NumberTextField
        label="Hva er ny deltakelsesprosent?"
        disabled={!pamelding.erUnderOppfolging}
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
          disabled={!pamelding.erUnderOppfolging}
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
      {pamelding.startdato && (
        <SimpleDatePicker
          label="Fra når gjelder ny deltakelsesmengde?"
          defaultDate={gyldigFra}
          fromDate={dateStrToNullableDate(pamelding.startdato) ?? undefined}
          toDate={dateStrToNullableDate(pamelding.sluttdato) ?? undefined}
          error={gyldigFraError ?? null}
          onValidate={(validation) => {
            if (validation.isBefore) {
              setgyldigFraError(
                'Datoen kan ikke velges fordi den er før deltakers startsdato'
              )
            } else if (validation.isAfter) {
              setgyldigFraError(
                'Datoen kan ikke velges fordi den er etter deltakers sluttdato'
              )
            } else if (validation.isInvalid) {
              setgyldigFraError('Ugyldig dato')
            } else {
              setgyldigFraError(undefined)
            }
          }}
          onChange={(date: Date | undefined) => setGyldigFra(date)}
          className="mt-4"
        />
      )}
      <BegrunnelseInput
        onChange={begrunnelse.handleChange}
        type={erBegrunnelseValgfri ? 'valgfri' : 'obligatorisk'}
        error={begrunnelse.error}
        disabled={!pamelding.erUnderOppfolging}
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
  const defaultGyldigFra = dayjs().isAfter(deltaker.sluttdato)
    ? dayjs(deltaker.sluttdato).toDate()
    : dayjs().toDate()
  if (forslag === null)
    return {
      deltakelsesprosent: deltaker.deltakelsesprosent ?? 100,
      dagerPerUke: deltaker.dagerPerUke,
      gyldigFra: defaultGyldigFra
    }
  if (isDeltakelsesmengde(forslag.endring)) {
    return {
      deltakelsesprosent: forslag.endring.deltakelsesprosent,
      dagerPerUke: forslag.endring.dagerPerUke,
      gyldigFra: forslag.endring.gyldigFra ?? defaultGyldigFra
    }
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som deltakelsesmengde`
    )
  }
}
