import { Textarea } from '@navikt/ds-react'
import { useState } from 'react'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../model/PameldingFormValues'

type BegrunnelseLabel = {
  label: string
  desc: string
}

type BegrunnelseType = 'valgfri' | 'obligatorisk' | 'avvis'

const labels: { [Key in BegrunnelseType]: BegrunnelseLabel } = {
  valgfri: {
    label: 'Vil du legge til noe mer begrunnelse? (valgfritt)',
    desc: 'Her kan NAV legge til mer info om hvorfor endringen er riktig for deltakeren.'
  },
  obligatorisk: {
    label: 'NAVs begrunnelse',
    desc: 'Beskriv kort hvorfor endringen er riktig for deltakeren.'
  },
  avvis: {
    label: 'NAVs begrunnelse',
    desc: 'Beskriv kort hvorfor endring ikke gjøres.'
  }
}

interface Props {
  valgfri?: boolean
  onChange: (value: string) => void
  error?: string
  type?: BegrunnelseType
}

export function BegrunnelseInput({ onChange, error, type }: Props) {
  const label = type ? labels[type] : labels['obligatorisk']

  const [begrunnelse, setBegrunnelse] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setBegrunnelse(value)
    onChange(value)
  }

  return (
    <Textarea
      onChange={handleChange}
      error={error}
      className="mt-6"
      label={label.label}
      description={label.desc}
      value={begrunnelse}
      maxLength={BEGRUNNELSE_MAKS_TEGN}
      id="begrunnelse"
      size="small"
      aria-label={'Begrunnelse'}
    />
  )
}

export function useBegrunnelse(valgfri: boolean) {
  const [begrunnelse, setBegrunnelse] = useState<string>('')
  const [error, setError] = useState<string>()

  const handleChange = (value: string) => {
    setBegrunnelse(value)
    if (value.length > BEGRUNNELSE_MAKS_TEGN) {
      setError(
        `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
    } else {
      setError(undefined)
    }
  }

  const valider = () => {
    if (!valgfri && begrunnelse.trim() === '') {
      setError('Du må fylle ut begrunnelse før du kan fortsette.')
      return false
    } else if (begrunnelse.length > BEGRUNNELSE_MAKS_TEGN) {
      setError(
        `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
      return false
    }
    setError(undefined)
    return true
  }

  return {
    begrunnelse,
    error,
    handleChange,
    valider
  }
}
