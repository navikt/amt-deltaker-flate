import { DateValidationT } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { DeltakerResponse } from '../api/data/deltaker'
import { useSluttdatoInput } from './use-sluttdato-input'
import { getSluttDatoFeilmelding, getVarighet, VarighetValg } from './varighet'

/**
 * Beregner sluttdato fra valgt varighet eller håndterer en manuelt valgt dato.
 * Returnerer ikke sluttdato når varighet eller dato har en valideringsfeil.
 */
export function useSluttdato({
  deltaker,
  valgtVarighet,
  defaultAnnetDato,
  startdato,
  erForleng
}: {
  deltaker: DeltakerResponse
  valgtVarighet?: VarighetValg
  defaultAnnetDato?: Date
  startdato?: Date
  erForleng?: boolean
}): {
  sluttdato: Date | undefined
  error: string | null
  varighetError: string | null
  annetError: string | null
  valider: () => boolean
  validerDato: (dateValidation: DateValidationT, newDate?: Date) => void
  handleChange: (date: Date | undefined) => void
} {
  const opprinneligSluttdato = deltaker.sluttdato

  const [sluttdato, setSluttdato] = useState<Date | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  /** Synkroniserer manuelt valgt sluttdato med hookens felles dato. */
  const onAnnetChange = (d: Date | undefined) => {
    setSluttdato(d)
  }

  const annet = useSluttdatoInput({
    deltaker,
    onChange: onAnnetChange,
    defaultDato: defaultAnnetDato,
    startdato,
    erSkjult: valgtVarighet !== VarighetValg.ANNET,
    erForleng
  })

  /**
   * Beregner sluttdato fra referansedato og varighet.
   * Ved forlengelse trekkes ikke én dag fra referansedatoen.
   */
  const kalkulerSluttdatoFra = (date: Date, varighetValg: VarighetValg) => {
    const varighet = getVarighet(varighetValg)
    return dayjs(date)
      .subtract(erForleng ? 0 : 1, 'day')
      .add(varighet.antall, varighet.tidsenhet)
      .toDate()
  }

  // ANNET bruker valgt dato. Andre varigheter beregnes fra startdato eller,
  // hvis den mangler, deltakerens opprinnelige sluttdato.
  useEffect(() => {
    if (valgtVarighet === VarighetValg.ANNET) {
      setSluttdato(annet.sluttdato)
    } else if (valgtVarighet && startdato) {
      setSluttdato(kalkulerSluttdatoFra(startdato, valgtVarighet))
    } else if (valgtVarighet && opprinneligSluttdato) {
      setSluttdato(kalkulerSluttdatoFra(opprinneligSluttdato, valgtVarighet))
    }
  }, [startdato, valgtVarighet])

  // Kun beregnede varigheter valideres her.
  // Feil for ANNET håndteres av useSluttdatoInput.
  useEffect(() => {
    if (sluttdato && valgtVarighet !== VarighetValg.ANNET) {
      setError(
        getSluttDatoFeilmelding(deltaker, sluttdato, startdato, erForleng)
      )
    } else if (valgtVarighet === VarighetValg.ANNET || !startdato) {
      setError(null)
    }
  }, [valgtVarighet, sluttdato])

  /** Setter feil for manglende valg og returnerer om dato og varighet er gyldige. */
  const valider = () => {
    if (!valgtVarighet) {
      setError('Du må velge en varighet')
      return false
    }
    if (!sluttdato) {
      if (valgtVarighet === VarighetValg.ANNET && !annet.error) {
        annet.setError('Du må velge en sluttdato')
      }
      return false
    }
    return error === null && annet.error === null
  }

  /** Sender DatePicker-resultatet videre til valideringen av manuell sluttdato. */
  const validerDato = (dateValidation: DateValidationT, newDate?: Date) => {
    annet.validate(dateValidation, newDate)
  }

  /** Endrer sluttdato bare når brukeren har valgt varigheten ANNET. */
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
