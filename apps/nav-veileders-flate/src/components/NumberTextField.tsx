import { TextField } from '@navikt/ds-react'

export interface NumberTextFieldProps {
  id: string
  className?: string
  label: string
  disabled: boolean
  value?: number
  error?: boolean | string
  required?: boolean
  onChange: (newValue: number | undefined) => void
}

export const NumberTextField = ({
  id,
  className,
  label,
  disabled,
  value,
  error,
  required,
  onChange
}: NumberTextFieldProps) => {
  return (
    <TextField
      label={label}
      size="small"
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
      value={value || ''}
      onChange={({ target }) => {
        const intValue = parseInt(target.value)
        if (intValue) onChange(intValue)
        else if (target.value === '') onChange(undefined)
        else onChange(value)
      }}
      error={error}
      aria-required={required}
      id={id}
      className={className ?? ''}
    />
  )
}
