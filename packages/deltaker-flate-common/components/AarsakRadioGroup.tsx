import { Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { DeltakerStatusAarsakType } from '../model/deltaker'
import { getDeltakerStatusAarsakTypeText } from '../utils/utils'
import { fjernUgyldigeTegn } from '../utils/utils'

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
  className?: string
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
  velgbareAarsaker,
  className
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
      className={className ?? ''}
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
