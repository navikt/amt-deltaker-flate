import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import { InfoCard, Radio, RadioGroup } from '@navikt/ds-react'
import { useState } from 'react'

export enum EndrePrisValgType {
  JA = 'JA',
  NEI = 'NEI'
}

interface Props {
  value?: EndrePrisValgType
  onChange: (value: EndrePrisValgType) => void
  error?: string
  disabled?: boolean
  className?: string
}

export const EndrePrisValg = ({
  value,
  onChange,
  error,
  disabled = false,
  className
}: Props) => {
  const valg = value

  return (
    <div className={className ?? ''}>
      <RadioGroup
        legend="Vil endringen påvirke pris og betalingsbetingelser?"
        id="endrePrisValg"
        size="small"
        aria-required
        required
        disabled={disabled}
        error={error}
        value={value}
        onChange={(nextValue) => onChange(nextValue as EndrePrisValgType)}
      >
        <Radio value={EndrePrisValgType.JA}>Ja</Radio>
        <Radio value={EndrePrisValgType.NEI}>Nei</Radio>
      </RadioGroup>

      {valg === EndrePrisValgType.JA && (
        <InfoCard data-color="warning" size="small" className="mt-4">
          <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
            <InfoCard.Title>
              Husk at du også må gjøre en endring i pris
            </InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            Når du lagrer denne endringen så får brukeren beskjed. De får også
            informasjon om at endringen forutsetter at endring i pris eller
            betalingsbetingelser blir godkjent.
          </InfoCard.Content>
        </InfoCard>
      )}
    </div>
  )
}

export function useEndrePrisValg(required: boolean = true) {
  const [endrePrisValg, setEndrePrisValg] = useState<EndrePrisValgType>()
  const [error, setError] = useState<string>()

  const handleChange = (value: EndrePrisValgType) => {
    setEndrePrisValg(value)
    setError(undefined)
  }

  const valider = () => {
    if (required && !endrePrisValg) {
      setError(
        'Du må velge om endringen vil påvirke pris og betalingsbetingelser før du kan fortsette.'
      )
      return false
    }

    setError(undefined)
    return true
  }

  return {
    endrePrisValg,
    error,
    handleChange,
    valider
  }
}
