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

export function PameldingDatoer({
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
    onDateChange: (date) => {
      setValue('startdato', date, { shouldDirty: true })
      clearErrors('startdato')
      handleStardatoChanged(date)
    }
  })

  const {
    datepickerProps: datepickerPropsSluttdato,
    inputProps: { onBlur: sluttdatoOnBlur, ...sluttdatoInputProps }
  } = useDatepicker({
    fromDate: startdato ?? dayjs().subtract(2, 'month').toDate(),
    toDate: maxSluttdato ?? undefined,
    defaultSelected: defaultSluttdato ?? undefined,
    onDateChange: (date) => {
      setValue('sluttdato', date, { shouldDirty: true })
      clearErrors('sluttdato')
    }
  })

  const handleBlur = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: 'startdato' | 'sluttdato'
  ) => {
    const parsed = getDayjsFromString(e.target.value)?.toDate()
    setValue(id, parsed, { shouldDirty: true })
    clearErrors(id)

    if (id === 'startdato' && parsed) {
      handleStardatoChanged(parsed)
    } else if (!startdato && !parsed) {
      // Fjerne feilmelding på manglende startdato hvis startdato ikke er satt og vi fjerne sluttdatoen
      clearErrors('startdato')
    }
  }

  const handleStardatoChanged = (newStart?: Date) => {
    // Hvis startdato endres kan sluttdato bli gyldig:
    const sluttdatoErGyldig =
      newStart &&
      sluttdato &&
      dayjs(sluttdato).isSameOrAfter(dayjs(newStart), 'date') &&
      (!maxSluttdato ||
        dayjs(sluttdato).isSameOrBefore(dayjs(maxSluttdato), 'date'))

    if (sluttdatoErGyldig) clearErrors('sluttdato')
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
                  handleBlur(event, 'startdato')
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
                  handleBlur(event, 'sluttdato')
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
