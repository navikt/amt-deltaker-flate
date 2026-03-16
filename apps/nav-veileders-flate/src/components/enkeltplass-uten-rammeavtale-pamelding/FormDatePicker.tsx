import { DatePicker, ErrorMessage, useDatepicker } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { getDayjsFromString } from '../../../../../packages/deltaker-flate-common/utils/utils'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues'
import { usePameldingFormContext } from './PameldingFormContext'
import dayjs from 'dayjs'
import { getMaxVarighetDato } from '../../utils/varighet'
import { usePameldingContext } from '../tiltak/PameldingContext'

interface Props {
  defaultStartdato?: Date
  defaultSluttdato?: Date
  className?: string
}

export function FormDatePicker({
  defaultStartdato,
  defaultSluttdato,
  className
}: Props) {
  const {
    control,
    setValue,
    watch,
    clearErrors,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const { disabled } = usePameldingFormContext()
  const { pamelding } = usePameldingContext()

  const startdato = watch('startdato')
  const sluttdato = watch('sluttdato')
  const maxSluttdato = startdato
    ? getMaxVarighetDato(pamelding, startdato)?.toDate()
    : undefined

  const {
    datepickerProps: datepickerPropsStartdato,
    inputProps: { onBlur: startdatoOnBlur, ...startdatoInputProps }
  } = useDatepicker({
    fromDate: dayjs().subtract(2, 'month').toDate(),
    defaultSelected: defaultStartdato ?? undefined,
    onDateChange: async (date) => {
      clearErrors('startdato')
      clearSluttdatoError(date, sluttdato)
      setValue('startdato', date, { shouldDirty: true })
    }
  })

  const {
    datepickerProps: datepickerPropsSluttdato,
    inputProps: { onBlur: sluttdatoOnBlur, ...sluttdatoInputProps }
  } = useDatepicker({
    fromDate: startdato ?? dayjs().subtract(2, 'month').toDate(),
    toDate: maxSluttdato ?? undefined,
    defaultSelected: defaultSluttdato ?? undefined,
    onDateChange: async (date) => {
      clearErrors('sluttdato')
      setValue('sluttdato', date, { shouldDirty: true })
    }
  })

  const handleDateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: 'startdato' | 'sluttdato'
  ) => {
    const date = getDayjsFromString(e.target.value)
    setValue(id, date?.toDate(), { shouldDirty: true })
    if (date?.isValid()) {
      if (id === 'startdato') {
        clearErrors('startdato')
        clearSluttdatoError(date?.toDate(), sluttdato)
      } else clearSluttdatoError(startdato, date?.toDate())
    }
  }

  const clearSluttdatoError = (nyStartDato?: Date, nySluttDato?: Date) => {
    if (!nySluttDato) clearErrors('sluttdato')
    if (!nyStartDato) {
      return
    }

    if (
      (dayjs(nySluttDato).isSameOrAfter(dayjs(nyStartDato), 'date') ||
        dayjs(nySluttDato).isBefore(dayjs(maxSluttdato), 'date')) &&
      dayjs(nySluttDato).isValid()
    ) {
      clearErrors('sluttdato')
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`}>
      <div className="flex gap-4 mt-8">
        <Controller
          control={control}
          name="startdato"
          render={({ field: { ref } }) => (
            <DatePicker {...datepickerPropsStartdato}>
              <DatePicker.Input
                className={className ?? ''}
                label="Startdato (valgfri)"
                ref={ref}
                {...startdatoInputProps}
                id="startdato"
                error={!!errors['startdato']?.message}
                aria-describedby="date-range-error"
                size="small"
                onBlur={(event) => {
                  startdatoOnBlur?.(event)
                  handleDateInputChange(event, 'startdato')
                }}
                disabled={disabled}
              />
            </DatePicker>
          )}
        />

        <Controller
          control={control}
          name="sluttdato"
          render={({ field: { ref } }) => (
            <DatePicker {...datepickerPropsSluttdato}>
              <DatePicker.Input
                className={className ?? ''}
                label="Sluttdato (valgfri)"
                ref={ref}
                {...sluttdatoInputProps}
                id="sluttdato"
                error={!!errors['sluttdato']?.message}
                aria-describedby="date-range-error"
                size="small"
                onBlur={(event) => {
                  sluttdatoOnBlur?.(event)
                  handleDateInputChange(event, 'sluttdato')
                }}
                disabled={disabled}
              />
            </DatePicker>
          )}
        />
      </div>
      <div
        id="date-range-error"
        aria-relevant="additions removals"
        aria-live="polite"
      >
        {(errors.startdato || errors.sluttdato) && (
          <ErrorMessage showIcon>
            {errors.startdato?.message || errors.sluttdato?.message}
          </ErrorMessage>
        )}
      </div>
    </div>
  )
}
