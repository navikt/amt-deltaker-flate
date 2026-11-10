import { DateValidationT } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { DeltakerResponse } from '../api/data/deltaker'
import {
  DATO_FOER_SLUTTDATO_FEILMELDING,
  SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO_FORMAT,
  VarighetValg,
  getSluttDatoFeilmelding,
  getVarighet
} from './varighet'

interface UseSluttdatoOpts {
  deltaker: DeltakerResponse
  valgtVarighet?: VarighetValg
  defaultAnnetDato?: Date
  startdato?: Date
  erForleng?: boolean
}

export function useSluttdato({
  deltaker,
  valgtVarighet,
  defaultAnnetDato,
  startdato,
  erForleng
}: UseSluttdatoOpts): {
  sluttdato: Date | undefined
  error: string | null
  varighetError: string | null
  annetError: string | null
  valider: () => boolean
  validerDato: (
    dateValidation: DateValidationT,
    newDate?: Date,
    errorMessage?: string
  ) => void
  handleChange: (date: Date | undefined) => void
} {
  const [sluttdato, setSluttdato] = useState<Date | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const onAnnetChange = (d: Date | undefined) => {
    setSluttdato(d)
  }

  const annet = useSluttdatoInput({
    deltaker,
    onChange: onAnnetChange,
    defaultDato: defaultAnnetDato,
    startdato,
    erSkjult: valgtVarighet !== VarighetValg.ANNET,
    erForleng,
    isRequired: valgtVarighet === VarighetValg.ANNET
  })

  const kalkulerSluttdatoFra = (date: Date, varighetValg: VarighetValg) => {
    const varighet = getVarighet(varighetValg)
    return dayjs(date)
      .subtract(erForleng ? 0 : 1, 'day')
      .add(varighet.antall, varighet.tidsenhet)
      .toDate()
  }

  useEffect(() => {
    if (valgtVarighet === VarighetValg.ANNET) {
      setSluttdato(annet.sluttdato)
    } else if (valgtVarighet && startdato) {
      setSluttdato(kalkulerSluttdatoFra(startdato, valgtVarighet))
    } else if (valgtVarighet && deltaker.sluttdato && erForleng) {
      // Hvis vi forlenger bruker vi deltakerens eksisterende sluttdato som utgangspunkt for kalkulering
      setSluttdato(kalkulerSluttdatoFra(deltaker.sluttdato, valgtVarighet))
    }
  }, [startdato, valgtVarighet, erForleng])

  useEffect(() => {
    if (sluttdato && valgtVarighet !== VarighetValg.ANNET) {
      setError(
        getSluttDatoFeilmelding(deltaker, sluttdato, startdato, erForleng)
      )
    } else if (valgtVarighet === VarighetValg.ANNET || !startdato) {
      setError(null)
    }
  }, [valgtVarighet, sluttdato])

  const valider = () => {
    if (!valgtVarighet) {
      setError('Du må velge en varighet')
      return false
    }
    if (!sluttdato) {
      if (valgtVarighet === VarighetValg.ANNET && annet.error === null) {
        annet.setError('Du må velge en sluttdato')
      }
      return false
    }
    return error === null && annet.error === null
  }

  const validerDato = (
    dateValidation: DateValidationT,
    newDate?: Date,
    errorMessage?: string
  ) => {
    annet.validate(dateValidation, newDate, errorMessage)
  }

  const handleChange = (date: Date | undefined) => {
    if (valgtVarighet === VarighetValg.ANNET) {
      annet.onChange(date)
    }
  }

  const hasError = error !== null || annet.error !== null

  return {
    sluttdato: hasError || valgtVarighet === undefined ? undefined : sluttdato,
    error: error || annet.error,
    varighetError: error,
    annetError: annet.error,
    valider,
    validerDato,
    handleChange
  }
}

interface SluttdatoInputOpts {
  deltaker: DeltakerResponse
  onChange?: (date: Date | undefined) => void
  defaultDato: Date | undefined
  startdato?: Date
  isRequired?: boolean
  erSkjult?: boolean
  erForleng?: boolean
  isAfterError?: string
  toDate?: Date
}
export function useSluttdatoInput({
  deltaker,
  onChange,
  defaultDato,
  toDate,
  startdato,
  erSkjult,
  erForleng,
  isAfterError,
  isRequired
}: SluttdatoInputOpts) {
  const [sluttdato, setSluttdato] = useState<Date | undefined>(defaultDato)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sluttdato) {
      setError(
        getSluttDatoFeilmelding(deltaker, sluttdato, startdato, erForleng)
      )
    } else {
      setError(null)
    }
  }, [startdato])

  // Kan sees i sammenheng med SimpleDatePicker handleDateInputChange, som sender disse verdiene.
  const validate = (
    dateValidation: DateValidationT,
    newDate?: Date,
    message?: string
  ) => {
    if (dateValidation.isBefore) {
      setError(
        startdato
          ? SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING
          : DATO_FOER_SLUTTDATO_FEILMELDING
      )
    } else if (dateValidation.isAfter && isAfterError) {
      setError(isAfterError)
    } else if (message) {
      setError(message)
    } else if (isRequired && dateValidation.isEmpty) {
      setError('Du må velge en sluttdato')
    } else if (dateValidation.isInvalid) {
      setError(UGYLDIG_DATO_FORMAT)
    } else if (newDate) {
      setError(getSluttDatoFeilmelding(deltaker, newDate, startdato, erForleng))
    }
  }

  const handleChange = (date: Date | undefined) => {
    setSluttdato(date)
    if (date) {
      if (toDate && isAfterError && dayjs(date).isAfter(toDate)) {
        setError(isAfterError)
      } else {
        setError(getSluttDatoFeilmelding(deltaker, date, startdato, erForleng))
      }
    }
    if (onChange) {
      onChange(date)
    }
  }

  const errorMsg = erSkjult ? null : error

  return {
    sluttdato,
    defaultDato,
    error: errorMsg,
    validate,
    setError,
    onChange: handleChange
  }
}
