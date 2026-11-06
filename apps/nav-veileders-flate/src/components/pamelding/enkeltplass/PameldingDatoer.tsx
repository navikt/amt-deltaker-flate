import { DatePicker, ErrorMessage, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Controller, useFormContext } from 'react-hook-form'
import { usePameldingFormContext } from '../PameldingFormContext'
import { useDeltakerContext } from '../../tiltak/DeltakerContext'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues,
  parsePameldingDato
} from '../../../model/PameldingEnkeltplassFormValues'
import {
  getMaxVarighetDato,
  MAX_START_DATO,
  MIN_START_DATO
} from '../../../utils/varighet'

interface Props {
  defaultStartdato?: string
  defaultSluttdato?: string
}

export function PameldingDatoer({ defaultStartdato, defaultSluttdato }: Props) {
  const {
    control,
    setValue,
    watch,
    clearErrors,
    trigger,
    formState: { errors, submitCount }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const { disabled } = usePameldingFormContext()
  const { deltaker } = useDeltakerContext()

  const startdato = watch('startdato')
  const startdatoDayjs = startdato ? parsePameldingDato(startdato) : undefined
  const sluttdato = watch('sluttdato')
  const maxSluttdato = startdatoDayjs
    ? getMaxVarighetDato(deltaker, startdatoDayjs?.toDate())?.toDate()
    : undefined

  const {
    datepickerProps: datepickerPropsStartdato,
    inputProps: { onBlur: startdatoOnBlur, ...startdatoInputProps }
  } = useDatepicker({
    fromDate: MIN_START_DATO,
    toDate: MAX_START_DATO,
    defaultSelected: defaultStartdato
      ? dayjs(defaultStartdato, DATE_FORMAT, true)?.toDate()
      : undefined,
    onDateChange: (date) => {
      // Kalles både ved klikk og tekstinput, date er undefined når den er ugyldig
      setValue('startdato', date ? dayjs(date).format(DATE_FORMAT) : '', {
        shouldDirty: true
      })
      clearErrors('startdato')
      handleStartdatoChanged()
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
      // Kalles både ved klikk og tekstinput, date er undefined når den er ugyldig
      setValue('sluttdato', date ? dayjs(date).format(DATE_FORMAT) : '', {
        shouldDirty: true
      })
      clearErrors('sluttdato')
    }
  })

  const handleBlur = (newDate: string, id: 'startdato' | 'sluttdato') => {
    const parsed = parsePameldingDato(newDate)

    setValue(id, parsed ? parsed.format(DATE_FORMAT) : newDate || '', {
      shouldDirty: true,
      shouldValidate: submitCount > 0
    })

    if (id === 'startdato') {
      handleStartdatoChanged()
    }
  }

  const handleStartdatoChanged = () => {
    if (submitCount > 0 && sluttdato) void trigger('sluttdato')
  }

  return (
    <div>
      <div className="flex gap-4">
        <Controller
          control={control}
          name="startdato"
          render={({ field: { ref } }) => (
            <DatePicker {...datepickerPropsStartdato}>
              <DatePicker.Input
                label="Startdato"
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
                label="Sluttdato"
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
