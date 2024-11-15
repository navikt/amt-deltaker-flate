import { DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import { formatDateToInputStr } from '../../utils/utils'
import { dateValidation } from './VarighetField'

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
  onChange
}: Props) {
  const [dateInput, setDateInput] = useState<string>(
    defaultDate ? formatDateToInputStr(defaultDate) : ''
  )
  const datePickerRef = useRef<HTMLInputElement>(null)
  const { datepickerProps } = useDatepicker({
    fromDate: fromDate,
    toDate: toDate,
    defaultSelected: defaultDate,
    defaultMonth: defaultMonth,
    onValidate: (dateValidation) => {
      onValidate(dateValidation)
    },
    onDateChange: (date) => {
      // Denne treffer valg i date picker fra klikk
      // den vil alltid velge gyldige datoer definert av datepicker.
      if (date) {
        setDateInput(formatDateToInputStr(date))
      }
      onChange(date)
    }
  })

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Denne treffers hvis vi endrer date-input med tastatur.
    setDateInput(e.target.value)

    const date = dayjs(e.target.value, 'DD.MM.YYYY', true)
    if (date.isValid()) {
      onChange(date.toDate())
      onValidate(dateValidation({ isValidDate: true }), date.toDate())
    } else {
      onValidate(dateValidation({ isInvalid: true }))
      onChange(undefined)
    }
  }

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input
        value={dateInput}
        ref={datePickerRef}
        label={label}
        error={error}
        size="small"
        onChange={handleDateInputChange}
        disabled={disabled}
      />
    </DatePicker>
  )
}
