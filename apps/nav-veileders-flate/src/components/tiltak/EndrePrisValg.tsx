import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import { InfoCard, List, Radio, RadioGroup } from '@navikt/ds-react'
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
}: Props) => (
  <div className={className ?? ''}>
    <RadioGroup
      legend="Vil endringen påvirke pris og betalingsbetingelser?"
      id="endrePrisValg"
      size="small"
      aria-required
      required
      disabled={disabled}
      error={error}
      value={value ?? ''}
      onChange={(nextValue) => onChange(nextValue as EndrePrisValgType)}
    >
      <Radio value={EndrePrisValgType.JA}>Ja</Radio>
      <Radio value={EndrePrisValgType.NEI}>Nei</Radio>
    </RadioGroup>

    {value === EndrePrisValgType.JA && (
      <InfoCard data-color="warning" size="small" className="mt-4">
        <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
          <InfoCard.Title>Dette må du gjøre</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <List as="ol" size="small">
            <List.Item>Lagre denne endringen.</List.Item>
            <List.Item>
              Legg inn en endring i pris og betalingsbetingelser.
            </List.Item>
          </List>
        </InfoCard.Content>
      </InfoCard>
    )}
  </div>
)

export function useEndrePrisValg() {
  const [endrePrisValg, setEndrePrisValg] = useState<EndrePrisValgType>()
  const [error, setError] = useState<string>()

  const handleChange = (value: EndrePrisValgType) => {
    setEndrePrisValg(value)
    setError(undefined)
  }

  const valider = () => {
    if (!endrePrisValg) {
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
