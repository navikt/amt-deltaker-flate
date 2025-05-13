import {
  Forslag,
  ForslagEndringAarsakType,
  ForslagEndringType
} from '../model/forslag.ts'
import { useState } from 'react'
import { DeltakerStatusAarsakType } from '../model/deltaker.ts'
import { BESKRIVELSE_ARSAK_ANNET_MAX_TEGN } from './AarsakRadioGroup.tsx'
import { getDeltakerStatusAarsak } from '../utils/forslagUtils.tsx'

export function useAarsak(forslag: Forslag | null) {
  const [initAarsak, initBeskrivelse] = getSluttaarsakFraForslag(forslag)

  const [aarsak, setAarsak] = useState<DeltakerStatusAarsakType | undefined>(
    initAarsak
  )
  const [aarsakError, setAarsakError] = useState<string>()

  const [beskrivelse, setBeskrivelse] = useState<string | undefined>(
    initBeskrivelse
  )
  const [beskrivelseError, setBeskrivelseError] = useState<string>()

  const handleChange = (value: DeltakerStatusAarsakType | undefined) => {
    setAarsak(value)
    setAarsakError(undefined)
  }

  const handleBeskrivelse = (value: string) => {
    setBeskrivelse(value)
    if (value.length > BESKRIVELSE_ARSAK_ANNET_MAX_TEGN) {
      setBeskrivelseError(
        `Beskrivelsen kan ikke være mer enn ${BESKRIVELSE_ARSAK_ANNET_MAX_TEGN} tegn`
      )
    } else {
      setBeskrivelseError(undefined)
    }
  }

  const valider = () => {
    if (aarsak === undefined) {
      setAarsakError('Du må velge en årsak før du kan fortsette.')
      return false
    } else if (aarsak === DeltakerStatusAarsakType.ANNET) {
      if (!beskrivelse) {
        setBeskrivelseError(
          'Du må fylle ut for årsak "annet" før du kan fortsette.'
        )
        return false
      } else if (beskrivelse.length > BESKRIVELSE_ARSAK_ANNET_MAX_TEGN) {
        setBeskrivelseError(
          `Beskrivelsen kan ikke være mer enn ${BESKRIVELSE_ARSAK_ANNET_MAX_TEGN} tegn`
        )
        return false
      }
    }
    return true
  }

  return {
    aarsak,
    beskrivelse:
      aarsak === DeltakerStatusAarsakType.ANNET ? beskrivelse : undefined,
    handleChange,
    handleBeskrivelse,
    aarsakError,
    beskrivelseError,
    valider
  }
}

const getSluttaarsakFraForslag = (
  forslag: Forslag | null
): [DeltakerStatusAarsakType | undefined, string | undefined] => {
  if (forslag === null) {
    return [undefined, undefined]
  }

  let aarsak = undefined
  switch (forslag?.endring.type) {
    case ForslagEndringType.IkkeAktuell:
    case ForslagEndringType.Sluttarsak:
    case ForslagEndringType.AvsluttDeltakelse: {
      aarsak = forslag.endring.aarsak
      break
    }
    default:
      throw new Error(`Forslag ${forslag?.endring.type} har ikke noen årsak`)
  }

  if (!aarsak) return [undefined, undefined]

  const beskrivelse =
    aarsak.type === ForslagEndringAarsakType.Annet
      ? aarsak.beskrivelse
      : undefined

  return [getDeltakerStatusAarsak(aarsak), beskrivelse]
}
