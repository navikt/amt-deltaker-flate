import { DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import {
  getDayjsFromString,
  harGyldigDatoformat
} from '../../../../../packages/deltaker-flate-common/utils/utils'
import { dateValidation, formatDateToInputStr } from '../../utils/utils'
import { MIN_START_DATO, UGYLDIG_DATO } from '../../utils/varighet'
import {
  DATE_FORMAT,
  parsePameldingDato
} from '../../model/PameldingEnkeltplassFormValues'

interface Props {
  label: string
  hideLabel?: boolean
  error: string | null
  fromDate?: Date
  toDate?: Date
  defaultDate?: Date
  defaultMonth?: Date
  disabled?: boolean
  onValidate: (
    validation: DateValidationT,
    newDate?: Date,
    errorMessage?: string
  ) => void
  onChange: (date: Date | undefined) => void
  className?: string
}

export function SimpleDatePicker({
  label,
  hideLabel,
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
  const [dateInput, setDateInput] = useState<string>(
    defaultDate ? formatDateToInputStr(defaultDate) : ''
  )
  const datePickerRef = useRef<HTMLInputElement>(null)
  const { datepickerProps } = useDatepicker({
    fromDate: fromDate ?? MIN_START_DATO,
    toDate: toDate,
    defaultSelected: defaultDate,
    defaultMonth: defaultMonth,
    onValidate: (dateValidation) => {
      // Denne treffer valg i date picker fra klikk
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

    if (!e.target.value) {
      onValidate(dateValidation({ isEmpty: true }))
      onChange(undefined)
      return
    }

    const gydligFormat = harGyldigDatoformat(e.target.value)

    const date = getDayjsFromString(e.target.value)
    if (date?.isValid()) {
      const isBefore = date.isBefore(fromDate ?? MIN_START_DATO, 'date')
      const isAfter = toDate ? date.isAfter(toDate, 'date') : false
      onChange(date.toDate())
      onValidate(
        dateValidation({ isValidDate: true, isBefore, isAfter }),
        date.toDate()
      )
    } else if (gydligFormat) {
      // Vil helst gi en feilmelding her om at datoen er i riktig format, men ikke gyldig
      onValidate(dateValidation({ isInvalid: true }), undefined, UGYLDIG_DATO)
      onChange(undefined)
    } else {
      onValidate(dateValidation({ isInvalid: true }))
      onChange(undefined)
    }
  }

  const handleBlur = (newDate: string) => {
    const parsed = parsePameldingDato(newDate)

    setDateInput(parsed ? parsed.format(DATE_FORMAT) : newDate || '')
  }

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input
        className={className ?? ''}
        value={dateInput}
        ref={datePickerRef}
        label={label}
        hideLabel={hideLabel}
        error={error}
        size="small"
        onChange={handleDateInputChange}
        onBlur={(e) => handleBlur(e.target.value)}
        disabled={disabled}
      />
    </DatePicker>
  )
}
