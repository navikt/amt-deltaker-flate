import { DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'
import { useRef } from 'react'
import {
  getDayjsFromString,
  harGyldigDatoformat
} from '../../../../../packages/deltaker-flate-common/utils/utils'
import { dateValidation } from '../../utils/utils'
import { MIN_START_DATO, UGYLDIG_DATO } from '../../utils/varighet'

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
  const datePickerRef = useRef<HTMLInputElement>(null)

  const {
    datepickerProps,
    inputProps: { onBlur: datoInputOnBlur, ...datoInputProps }
  } = useDatepicker({
    fromDate: fromDate ?? MIN_START_DATO,
    toDate: toDate,
    defaultSelected: defaultDate,
    defaultMonth: defaultMonth,
    onDateChange: (date) => {
      // Denne treffer valg i date picker fra klikk og tastatur
      onChange(date)
    }
  })

  const handleBlur = (newDate: string) => {
    // Kalles kun ved å frlate inputfeltet.
    // Datovelger med klikk velger gyldig dato så lenge vi setter riktige grenseverdier for fromDate og toDate
    if (!newDate) {
      onValidate(dateValidation({ isEmpty: true }))
      onChange(undefined)
      return
    }

    const harGydligFormat = harGyldigDatoformat(newDate)

    const date = getDayjsFromString(newDate)
    if (date?.isValid()) {
      const isBefore = date.isBefore(fromDate ?? MIN_START_DATO, 'date')
      const isAfter = toDate ? date.isAfter(toDate, 'date') : false
      onChange(date.toDate())
      onValidate(
        dateValidation({ isValidDate: true, isBefore, isAfter }),
        date.toDate()
      )
    } else if (harGydligFormat) {
      onValidate(dateValidation({ isInvalid: true }), undefined, UGYLDIG_DATO)
      onChange(undefined)
    } else {
      onValidate(dateValidation({ isInvalid: true }))
      onChange(undefined)
    }
  }

  return (
    <DatePicker
      {...datepickerProps}
      onDayClick={(dato, modifiers, event) => {
        // Kalles når en dag blir klikket i date picker
        datepickerProps.onDayClick?.(dato, modifiers, event)

        // Sjekk om datoen som ble klikket allerede var valgt (toggle)
        const varDatoValgt = modifiers.selected

        onValidate(
          dateValidation({ isEmpty: varDatoValgt, isValidDate: !varDatoValgt }),
          varDatoValgt ? undefined : dato
        )
      }}
    >
      <DatePicker.Input
        className={className ?? ''}
        ref={datePickerRef}
        label={label}
        hideLabel={hideLabel}
        error={error}
        size="small"
        {...datoInputProps}
        onBlur={(e) => {
          datoInputOnBlur?.(e)
          handleBlur(e.target.value)
        }}
        disabled={disabled}
      />
    </DatePicker>
  )
}
