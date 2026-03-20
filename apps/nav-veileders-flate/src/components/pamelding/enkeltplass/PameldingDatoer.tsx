import { DatePicker, ErrorMessage, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Controller, useFormContext } from 'react-hook-form'
import { getDayjsFromString } from '../../../../../packages/deltaker-flate-common/utils/utils'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../../model/PameldingEnkeltplassFormValues'
import { getMaxVarighetDato } from '../../utils/varighet'
import { usePameldingContext } from '../tiltak/PameldingContext'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext'

interface Props {
  defaultStartdato?: string
  defaultSluttdato?: string
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
  const startdatoDayjs = startdato
    ? dayjs(startdato, DATE_FORMAT, true)
    : undefined
  const sluttdato = watch('sluttdato')
  const maxSluttdato = startdatoDayjs
    ? getMaxVarighetDato(pamelding, startdatoDayjs?.toDate())?.toDate()
    : undefined

  const {
    datepickerProps: datepickerPropsStartdato,
    inputProps: { onBlur: startdatoOnBlur, ...startdatoInputProps }
  } = useDatepicker({
    fromDate: dayjs().subtract(2, 'month').toDate(),
    defaultSelected: defaultStartdato
      ? dayjs(defaultStartdato, DATE_FORMAT, true)?.toDate()
      : undefined,
    onDateChange: (date) => {
      setValue(
        'startdato',
        date ? dayjs(date).format(DATE_FORMAT) : undefined,
        { shouldDirty: true }
      )
      clearErrors('startdato')
      handleStardatoChanged(date)
    }
  })

  const {
    datepickerProps: datepickerPropsSluttdato,
    inputProps: { onBlur: sluttdatoOnBlur, ...sluttdatoInputProps }
  } = useDatepicker({
    fromDate: startdatoDayjs?.toDate() ?? dayjs().subtract(2, 'month').toDate(),
    toDate: maxSluttdato ?? undefined,
    defaultSelected: defaultSluttdato
      ? dayjs(defaultSluttdato, DATE_FORMAT, true)?.toDate()
      : undefined,
    onDateChange: (date) => {
      setValue(
        'sluttdato',
        date ? dayjs(date).format(DATE_FORMAT) : undefined,
        { shouldDirty: true }
      )
      clearErrors('sluttdato')
    }
  })

  const handleBlur = (newDate: string, id: 'startdato' | 'sluttdato') => {
    const parsed = getDayjsFromString(newDate)

    if (parsed?.isValid()) {
      setValue(id, parsed?.format(DATE_FORMAT), { shouldDirty: true })
    } else {
      setValue(id, newDate, { shouldDirty: true })
    }

    clearErrors(id)

    if (id === 'startdato' && parsed) {
      handleStardatoChanged(parsed.toDate())
    } else if (!startdato && !parsed) {
      // Fjerne feilmelding på manglende startdato hvis startdato ikke er satt og vi fjerne sluttdatoen
      clearErrors('startdato')
    }
  }

  // Hvis startdato endres kan sluttdato bli gyldig:
  const handleStardatoChanged = (newStart?: Date) => {
    const sluttdatoDayjs = sluttdato
      ? dayjs(sluttdato, DATE_FORMAT, true)
      : undefined

    const sluttdatoErGyldig =
      newStart &&
      sluttdatoDayjs &&
      sluttdatoDayjs.isSameOrAfter(newStart, 'date') &&
      (!maxSluttdato || sluttdatoDayjs.isSameOrBefore(maxSluttdato, 'date'))

    if (sluttdatoErGyldig) clearErrors('sluttdato')
  }

  return (
    <div className={className ?? ''}>
      <div className="flex gap-4">
        <Controller
          control={control}
          name="startdato"
          render={({ field: { ref } }) => (
            <DatePicker {...datepickerPropsStartdato}>
              <DatePicker.Input
                label="Startdato (valgfri)"
                ref={ref}
                {...startdatoInputProps}
                id="startdato"
                error={!!errors['startdato']?.message}
                aria-describedby="startdato-error"
                size="small"
                onBlur={(event) => {
                  startdatoOnBlur?.(event)
                  handleBlur(event.target.value, 'startdato')
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
                label="Sluttdato (valgfri)"
                ref={ref}
                {...sluttdatoInputProps}
                id="sluttdato"
                error={!!errors['sluttdato']?.message}
                aria-describedby="sluttdato-error"
                size="small"
                onBlur={(event) => {
                  sluttdatoOnBlur?.(event)
                  handleBlur(event.target.value, 'sluttdato')
                }}
                disabled={disabled}
              />
            </DatePicker>
          )}
        />
      </div>
      <div
        className="mt-4"
        id="startdato-error"
        aria-relevant="additions removals"
        aria-live="polite"
      >
        {errors.startdato && (
          <ErrorMessage showIcon>{errors.startdato?.message}</ErrorMessage>
        )}
      </div>
      <div
        className="mt-2"
        id="sluttdato-error"
        aria-relevant="additions removals"
        aria-live="polite"
      >
        {errors.sluttdato && (
          <ErrorMessage showIcon>{errors.sluttdato?.message}</ErrorMessage>
        )}
      </div>
    </div>
  )
}
