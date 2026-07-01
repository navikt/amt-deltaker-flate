import dayjs from 'dayjs'
import {
  BegrunnelseInput,
  DeltakelsesmengdeForslag,
  EndreDeltakelseType,
  Forslag,
  ForslagEndring,
  ForslagEndringType,
  useBegrunnelse
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { EndreDeltakelsesmengdeRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import {
  getDagerPerUkeError,
  getProsentError
} from '../../../utils/deltakelsesmengdeValidering.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { formatDateToDtoStr } from '../../../utils/utils.ts'
import { NumberTextField } from '../../NumberTextField.tsx'
import { SimpleDatePicker } from '../SimpleDatePicker.tsx'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface EndreDeltakelsesmengdeModalProps {
  deltaker: DeltakerResponse
  open: boolean
  forslag: Forslag | null
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

export const EndreDeltakelsesmengdeModal = ({
  deltaker,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreDeltakelsesmengdeModalProps) => {
  const defaultMengde = getMengde(deltaker, forslag)

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
  const { enhetId } = useAppContext()

  const erEnkeltplass = deltaker.deltakerliste.erEnkeltplass

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
      const siste = deltaker.deltakelsesmengder.sisteDeltakelsesmengde
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

    validerDeltakerKanEndres(deltaker)

    const dagerPerUkeJustert = () => {
      if (erEnkeltplass) {
        return dagerPerUke ?? undefined
      }
      if (dagerPerUke != null && deltakelsesprosent !== 100) {
        return dagerPerUke
      }
      return undefined
    }

    const body: EndreDeltakelsesmengdeRequest = {
      deltakelsesprosent: erEnkeltplass ? undefined : deltakelsesprosent,
      dagerPerUke: dagerPerUkeJustert(),
      gyldigFra: formatDateToDtoStr(gyldigFra),
      begrunnelse: begrunnelse.begrunnelse ?? null,
      forslagId: forslag?.id ?? null
    }
    return {
      deltakerId: deltaker.deltakerId,
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

  const visDagerIUka =
    erEnkeltplass || (deltakelsesprosent != null && deltakelsesprosent != 100)
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
      {!erEnkeltplass && (
        <NumberTextField
          label="Hva er ny deltakelsesprosent?"
          disabled={!deltaker.erUnderOppfolging}
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
      )}
      {visDagerIUka && (
        <NumberTextField
          label={
            erEnkeltplass
              ? 'Antall dager i uka som personen deltar (valgfritt)'
              : 'Hvor mange dager i uka? (valgfritt)'
          }
          description={
            erEnkeltplass
              ? 'Fyll ut hvis personen skal søke om tiltakspenger eller tilleggsstønader'
              : undefined
          }
          disabled={!deltaker.erUnderOppfolging}
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
      {deltaker.startdato && (
        <SimpleDatePicker
          label="Fra når gjelder ny deltakelsesmengde?"
          defaultDate={gyldigFra}
          fromDate={deltaker.startdato ?? undefined}
          toDate={deltaker.sluttdato ?? undefined}
          error={gyldigFraError ?? null}
          onValidate={(validation) => {
            if (validation.isBefore) {
              setGyldigFraError(
                'Datoen kan ikke velges fordi den er før deltakers startsdato'
              )
            } else if (validation.isAfter) {
              setGyldigFraError(
                'Datoen kan ikke velges fordi den er etter deltakers sluttdato'
              )
            } else if (validation.isInvalid) {
              setGyldigFraError('Ugyldig dato')
            } else {
              setGyldigFraError(undefined)
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
        disabled={!deltaker.erUnderOppfolging}
      />
    </Endringsmodal>
  )
}

function isDeltakelsesmengde(
  endring: ForslagEndring
): endring is DeltakelsesmengdeForslag {
  return endring.type === ForslagEndringType.Deltakelsesmengde
}

function getMengde(deltaker: DeltakerResponse, forslag: Forslag | null) {
  const defaultGyldigFra = dayjs().isAfter(deltaker.sluttdato)
    ? dayjs(deltaker.sluttdato).toDate()
    : deltaker.startdato && dayjs().isBefore(deltaker.startdato)
      ? dayjs(deltaker.startdato).toDate()
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
