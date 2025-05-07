import { Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { DeltakerStatusAarsakType } from '../model/deltaker'
import {
  Forslag,
  ForslagEndringAarsakType,
  ForslagEndringType
} from '../model/forslag'
import { getDeltakerStatusAarsakTypeText } from '../utils/utils'
import { fjernUgyldigeTegn } from '../utils/utils'
import { useState } from 'react'
import { getDeltakerStatusAarsak } from '../utils/forslagUtils'

export const BESKRIVELSE_ARSAK_ANNET_MAX_TEGN = 40

export const avslagAarsaker = [
  DeltakerStatusAarsakType.KRAV_IKKE_OPPFYLT,
  DeltakerStatusAarsakType.KURS_FULLT,
  DeltakerStatusAarsakType.ANNET
]

const standardAarsaker = [
  DeltakerStatusAarsakType.FATT_JOBB,
  DeltakerStatusAarsakType.IKKE_MOTT,
  DeltakerStatusAarsakType.SYK,
  DeltakerStatusAarsakType.TRENGER_ANNEN_STOTTE,
  DeltakerStatusAarsakType.UTDANNING,
  DeltakerStatusAarsakType.ANNET
]

interface Props {
  aarsak: DeltakerStatusAarsakType | undefined
  aarsakError?: string
  beskrivelse: string | undefined
  beskrivelseError: string | undefined
  legend: string
  disabled?: boolean
  velgbareAarsaker?: DeltakerStatusAarsakType[]
  onChange: (value: DeltakerStatusAarsakType) => void
  onBeskrivelse: (beskrivelse: string) => void
}

export function AarsakRadioGroup({
  aarsak,
  aarsakError,
  beskrivelse,
  beskrivelseError,
  onChange,
  onBeskrivelse,
  legend,
  disabled,
  velgbareAarsaker
}: Props) {
  const tilgjengeligeAarsaker = velgbareAarsaker ?? standardAarsaker

  return (
    <RadioGroup
      legend={legend}
      size="small"
      error={aarsakError}
      onChange={onChange}
      value={aarsak ?? ''}
      disabled={disabled}
    >
      <>
        {tilgjengeligeAarsaker.map((arsakType) => (
          <Radio value={arsakType} key={arsakType}>
            {getDeltakerStatusAarsakTypeText(arsakType)}
          </Radio>
        ))}
        {aarsak === DeltakerStatusAarsakType.ANNET && (
          <Textarea
            onChange={(e) => onBeskrivelse(fjernUgyldigeTegn(e.target.value))}
            value={beskrivelse ?? ''}
            minRows={1}
            rows={1}
            size="small"
            label={null}
            error={beskrivelseError}
            maxLength={BESKRIVELSE_ARSAK_ANNET_MAX_TEGN}
            aria-label={'Beskrivelse for Annet'}
          />
        )}
      </>
    </RadioGroup>
  )
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
  const beskrivelse =
    aarsak.type === ForslagEndringAarsakType.Annet
      ? aarsak.beskrivelse
      : undefined

  return [getDeltakerStatusAarsak(aarsak), beskrivelse]
}

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

  const handleChange = (value: DeltakerStatusAarsakType) => {
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
