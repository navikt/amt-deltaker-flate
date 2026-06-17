import { Label, TextField } from '@navikt/ds-react'
import { Ref, forwardRef } from 'react'

export interface NumberTextFieldProps {
  id: string
  className?: string
  containerClassName?: string
  labelClassName?: string
  label: string
  description?: string
  inlineLabel?: boolean
  disabled: boolean
  value?: number
  error?: boolean | string
  required?: boolean
  onChange: (newValue: number | undefined) => void
  onBlur?: () => void
}

const NumberTextFieldComponent = (
  {
    id,
    className,
    containerClassName,
    labelClassName,
    label,
    description,
    inlineLabel,
    disabled,
    value,
    error,
    required,
    onChange,
    onBlur
  }: NumberTextFieldProps,
  ref: Ref<HTMLInputElement>
) => {
  const textField = (
    <TextField
      ref={ref}
      label={label}
      hideLabel={inlineLabel}
      description={description}
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
      onBlur={onBlur}
      error={error}
      aria-required={required}
      id={id}
      className={className ?? ''}
    />
  )

  if (inlineLabel) {
    return (
      <div className={`flex items-center gap-3 ${containerClassName ?? ''}`}>
        <Label htmlFor={id} size="small" className={labelClassName ?? 'mb-0'}>
          {label}
        </Label>
        {textField}
      </div>
    )
  }

  return <div className={containerClassName ?? ''}>{textField}</div>
}

export const NumberTextField = forwardRef<
  HTMLInputElement,
  NumberTextFieldProps
>(NumberTextFieldComponent)
