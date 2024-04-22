import { TextField } from '@navikt/ds-react'
import { Ref, forwardRef } from 'react'

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

const NumberTextFieldComponent = (
  {
    id,
    className,
    label,
    disabled,
    value,
    error,
    required,
    onChange
  }: NumberTextFieldProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <TextField
      ref={ref}
      label={label}
      size="small"
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
      value={value ?? ''}
      onChange={({ target }) => {
        const intValue = parseInt(target.value)
        if (!Number.isNaN(intValue)) onChange(intValue)
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

export const NumberTextField = forwardRef<
  HTMLInputElement,
  NumberTextFieldProps
>(NumberTextFieldComponent)
