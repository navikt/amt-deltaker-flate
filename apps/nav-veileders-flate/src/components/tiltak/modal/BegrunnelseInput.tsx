import { Textarea } from '@navikt/ds-react'
import { useState } from 'react'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../model/PameldingFormValues'

interface Props {
  valgfri?: boolean
  onChange: (value: string) => void
  error?: string
}

export function BegrunnelseInput({ valgfri, onChange, error }: Props) {
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
      label={`NAVs begrunnelse${valgfri ? ' (valgfri)' : ''}`}
      description="Beskriv kort hvorfor endringen er riktig for personen."
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
      setError('Begrunnelse er påkrevd')
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
