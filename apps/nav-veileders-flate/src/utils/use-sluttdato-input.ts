import { DateValidationT } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { DeltakerResponse } from '../api/data/deltaker'
import {
  DATO_FOER_SLUTTDATO_FEILMELDING,
  SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO_FEILMELDING,
  getSisteGyldigeSluttDato,
  getSluttDatoFeilmelding,
  getSenesteTillatteSluttdato,
  getVarighetValgFeilmelding
} from './varighet'

/**
 * Håndterer manuell sluttdato og validering fra Aksels DatePicker.
 */
export function useSluttdatoInput({
  deltaker,
  onChange,
  defaultDato,
  startdato,
  erSkjult,
  erForleng,
  isAfterError,
  toDate
}: {
  deltaker: DeltakerResponse
  onChange?: (date: Date | undefined) => void
  defaultDato: Date | undefined
  startdato?: Date
  erSkjult?: boolean
  erForleng?: boolean
  isAfterError?: string
  toDate?: Date
}) {
  const [sluttdato, setSluttdato] = useState<Date | undefined>(defaultDato)
  const [error, setError] = useState<string | null>(null)
  // Aksel kan avvise tekst uten å gi en dato; formatfeil spores derfor separat.
  const avvistDato = useRef<Date | undefined>(undefined)
  const harUgyldigFormat = useRef(false)

  // Ved startdatoendring oppdateres grensefeilen, men feil for avvist input beholdes.
  useEffect(() => {
    if (sluttdato) {
      setError(
        getSluttDatoFeilmelding(deltaker, sluttdato, startdato, erForleng)
      )
    } else if (!avvistDato.current && !harUgyldigFormat.current) {
      setError(null)
    }
  }, [startdato])

  /** Lagrer valgt dato, nullstiller avvist input og varsler eventuell caller. */
  const handleChange = (date: Date | undefined) => {
    setSluttdato(date)
    avvistDato.current = undefined
    harUgyldigFormat.current = false
    if (date) {
      if (toDate && isAfterError && dayjs(date).isAfter(toDate)) {
        setError(isAfterError)
      } else {
        setError(getSluttDatoFeilmelding(deltaker, date, startdato, erForleng))
      }
    } else {
      setError(null)
    }
    if (onChange) {
      onChange(date)
    }
  }

  /**
   * Håndterer datoer etter DatePickers grense, eller godtar datoen hvis øvrig
   * validering ikke finner feil.
   */
  const setAfterDateError = (newDate?: Date) => {
    if (isAfterError) {
      setError(isAfterError)
      return
    }

    if (newDate) {
      const newDateError = getSluttDatoFeilmelding(
        deltaker,
        newDate,
        startdato,
        erForleng
      )
      if (newDateError) {
        setError(newDateError)
      } else {
        handleChange(newDate)
      }
      return
    }

    const maxDate = toDate ?? getSisteGyldigeSluttDato(deltaker, startdato)
    const dateAfterMax = maxDate
      ? dayjs(maxDate).add(1, 'day').toDate()
      : undefined
    const dateAfterMaxError = dateAfterMax
      ? getSluttDatoFeilmelding(deltaker, dateAfterMax, startdato, erForleng)
      : undefined
    setError(
      dateAfterMaxError ??
        getVarighetValgFeilmelding(
          getSenesteTillatteSluttdato(deltaker.sluttdato, maxDate)
        )
    )
  }

  /** Oversetter DatePicker-validering til feil og holder styr på avvist input. */
  const validate = (dateValidation: DateValidationT, newDate?: Date) => {
    if (dateValidation.isInvalid) {
      avvistDato.current = undefined
      harUgyldigFormat.current = true
      setError(UGYLDIG_DATO_FEILMELDING)
      return
    }

    avvistDato.current =
      dateValidation.isBefore || dateValidation.isAfter ? newDate : undefined
    harUgyldigFormat.current = false

    if (dateValidation.isBefore) {
      setError(
        startdato
          ? SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING
          : DATO_FOER_SLUTTDATO_FEILMELDING
      )
      return
    }

    if (dateValidation.isAfter) {
      setAfterDateError(newDate)
      return
    }

    if (newDate) {
      setError(getSluttDatoFeilmelding(deltaker, newDate, startdato, erForleng))
    }
  }

  const errorMsg = erSkjult ? null : error

  return {
    sluttdato: errorMsg ? undefined : sluttdato,
    defaultDato,
    error: errorMsg,
    validate,
    setError,
    onChange: handleChange
  }
}
