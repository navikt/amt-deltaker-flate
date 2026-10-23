import { DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'

interface Props {
  label: string
  error: string | null
  fromDate?: Date
  toDate?: Date
  defaultDate?: Date
  defaultMonth?: Date
  disabled?: boolean
  onValidate: (validation: DateValidationT, newDate?: Date) => void
  onChange: (date: Date | undefined) => void
  className?: string
}

export function SimpleDatePicker({
  label,
  error,
  fromDate,
  toDate,
  defaultDate,
  defaultMonth,
  disabled,
  onValidate,
  onChange,
  className
}: Props) {
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: fromDate,
    toDate: toDate,
    defaultSelected: defaultDate,
    defaultMonth: defaultMonth,
    onValidate: (dateValidation) => {
      onValidate(dateValidation)
    },
    onDateChange: onChange
  })

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input
        {...inputProps}
        className={className ?? ''}
        label={label}
        error={error}
        size="small"
        disabled={disabled}
      />
    </DatePicker>
  )
}
