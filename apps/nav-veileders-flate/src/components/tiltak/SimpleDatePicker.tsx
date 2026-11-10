import { DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'
import { type FocusEvent, useRef } from 'react'
import {
  getDayjsFromString,
  harGyldigDatoformat
} from '../../../../../packages/deltaker-flate-common/utils/utils'
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
  const valgtDato = useRef<Date | undefined>(defaultDate)
  const validering = useRef<DateValidationT | null>(null)

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: fromDate ?? MIN_START_DATO,
    toDate,
    defaultSelected: defaultDate,
    defaultMonth,
    onDateChange: (date) => {
      valgtDato.current = date
      onChange(date)
    },
    onValidate: (validation) => {
      validering.current = validation
      if (validation.isValidDate) {
        onValidate(validation, valgtDato.current)
      }
    }
  })

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    // Aksel oppdaterer dato (onDateChange) og valideringsresultat (onValidate) under skriving i inputfeltet og etter klikk.
    // Ved blur fra inputfeltet videreformidles resultatet, også når datoen er ugyldig.

    inputProps.onBlur?.(event)
    if (
      validering.current?.isInvalid &&
      harGyldigDatoformat(event.currentTarget.value) &&
      !getDayjsFromString(event.currentTarget.value)?.isValid()
    ) {
      onValidate(validering.current, valgtDato.current, UGYLDIG_DATO)
    } else if (validering.current?.isBefore || validering.current?.isAfter) {
      onValidate(
        validering.current,
        getDayjsFromString(event.currentTarget.value)?.toDate()
      )
    } else if (validering.current) {
      onValidate(validering.current, valgtDato.current)
    }
  }

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input
        {...inputProps}
        onBlur={handleBlur}
        className={className ?? ''}
        label={label}
        hideLabel={hideLabel}
        error={error}
        size="small"
        disabled={disabled}
      />
    </DatePicker>
  )
}
