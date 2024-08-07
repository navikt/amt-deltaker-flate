import { DateValidationT } from '@navikt/ds-react'
import { PameldingResponse } from '../api/data/pamelding'
import {
  DATO_FØR_SLUTTDATO_FEILMELDING,
  SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO_FEILMELDING,
  VarighetValg,
  getSluttDatoFeilmelding,
  getVarighet
} from './varighet'
import { getDateFromString } from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface UseSluttdatoOpts {
  deltaker: PameldingResponse
  valgtVarighet: VarighetValg | undefined
  defaultAnnetDato?: Date
  startdato?: Date
}

export function useSluttdato({
  deltaker,
  valgtVarighet,
  defaultAnnetDato,
  startdato
}: UseSluttdatoOpts): {
  sluttdato: Date | undefined
  error: string | null
  valider: () => boolean
  validerDato: (dateValidation: DateValidationT, date?: Date) => void
  handleChange: (date: Date | undefined) => void
} {
  const opprinneligSluttdato = getDateFromString(deltaker.sluttdato)

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
    erSkjult: valgtVarighet !== VarighetValg.ANNET
  })

  const kalkulerSluttdatoFra = (date: Date, varighetValg: VarighetValg) => {
    const varighet = getVarighet(varighetValg)
    return dayjs(date).add(varighet.antall, varighet.tidsenhet).toDate()
  }

  useEffect(() => {
    if (valgtVarighet === VarighetValg.ANNET) {
      setSluttdato(annet.sluttdato)
    } else if (valgtVarighet && startdato) {
      setSluttdato(kalkulerSluttdatoFra(startdato, valgtVarighet))
    } else if (valgtVarighet && opprinneligSluttdato) {
      setSluttdato(kalkulerSluttdatoFra(opprinneligSluttdato, valgtVarighet))
    }
  }, [startdato, valgtVarighet])

  useEffect(() => {
    if (sluttdato && valgtVarighet !== VarighetValg.ANNET) {
      setError(getSluttDatoFeilmelding(deltaker, sluttdato, startdato))
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
      setError('Du må velge en sluttdato')
      return false
    }
    return error === null && annet.error === null
  }

  const validerDato = (dateValidation: DateValidationT, date?: Date) => {
    annet.validate(dateValidation, date)
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
    valider,
    validerDato,
    handleChange
  }
}

interface SluttdatoInputOpts {
  deltaker: PameldingResponse
  onChange?: (date: Date | undefined) => void
  defaultDato: Date | undefined
  startdato?: Date
  erSkjult?: boolean
}
export function useSluttdatoInput({
  deltaker,
  onChange,
  defaultDato,
  startdato,
  erSkjult
}: SluttdatoInputOpts) {
  const [sluttdato, setSluttdato] = useState<Date | undefined>(defaultDato)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sluttdato) {
      setError(getSluttDatoFeilmelding(deltaker, sluttdato, startdato))
    } else {
      setError(null)
    }
  }, [startdato])

  const validate = (dateValidation: DateValidationT, date?: Date) => {
    if (dateValidation.isInvalid) {
      setError(UGYLDIG_DATO_FEILMELDING)
    } else if (dateValidation.isBefore) {
      setError(
        startdato
          ? SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING
          : DATO_FØR_SLUTTDATO_FEILMELDING
      )
    } else if (date) {
      setError(getSluttDatoFeilmelding(deltaker, date, startdato))
    } else {
      setError(null)
    }
  }

  const handleChange = (date: Date | undefined) => {
    if (date) {
      setSluttdato(date)
      setError(getSluttDatoFeilmelding(deltaker, date, startdato))
    }
    if (onChange) {
      onChange(date)
    }
  }

  const errorMsg = erSkjult ? null : error

  return { sluttdato, error: errorMsg, validate, onChange: handleChange }
}
