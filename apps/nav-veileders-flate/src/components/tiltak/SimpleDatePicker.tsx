import { DateValidationT, useDatepicker, DatePicker } from '@navikt/ds-react'
import { getDateFromNorwegianStringFormat } from 'deltaker-flate-common'
import { useRef } from 'react'

interface Props {
  label: string
  error: string | null
  fromDate?: Date
  toDate?: Date
  defaultDate?: Date
  defaultMonth?: Date
  onValidate: (validation: DateValidationT, date?: Date) => void
  onChange: (date: Date | undefined) => void
}

export function SimpleDatePicker({
  label,
  error,
  fromDate,
  toDate,
  defaultDate,
  defaultMonth,
  onValidate,
  onChange
}: Props) {
  const datePickerRef = useRef<HTMLInputElement>(null)
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: fromDate,
    toDate: toDate,
    defaultSelected: defaultDate,
    defaultMonth: defaultMonth,
    onValidate: (dateValidation) => {
      onValidate(
        dateValidation,
        getDateFromNorwegianStringFormat(datePickerRef?.current?.value)
      )
    },
    onDateChange: onChange
  })

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input
        {...inputProps}
        ref={datePickerRef}
        label={label}
        error={error}
        size="small"
      />
    </DatePicker>
  )
}
