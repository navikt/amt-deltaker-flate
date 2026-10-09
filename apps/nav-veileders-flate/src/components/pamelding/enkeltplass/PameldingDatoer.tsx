import { DatePicker, ErrorMessage, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { usePameldingFormContext } from '../PameldingFormContext'
import { useDeltakerContext } from '../../tiltak/DeltakerContext'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../../../model/PameldingEnkeltplassFormValues'
import { getMaxVarighetDato } from '../../../utils/varighet'

export function PameldingDatoer() {
  const {
    control,
    clearErrors,
    trigger,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const { field: startdatoField } = useController({
    control,
    name: 'startdato'
  })
  const { field: sluttdatoField } = useController({
    control,
    name: 'sluttdato'
  })
  const { disabled } = usePameldingFormContext()
  const { deltaker } = useDeltakerContext()

  const startdato = startdatoField.value
  const tidligsteStartdato = dayjs().subtract(2, 'month')
  const startdatoDayjs = startdato
    ? dayjs(startdato, DATE_FORMAT, true)
    : undefined
  const sluttdatoDayjs = sluttdatoField.value
    ? dayjs(sluttdatoField.value, DATE_FORMAT, true)
    : undefined
  const [startdatoIsInvalid, setStartdatoIsInvalid] = useState(false)
  const [sluttdatoIsInvalid, setSluttdatoIsInvalid] = useState(false)
  const previousStartdato = useRef(startdato)

  useEffect(() => {
    if (previousStartdato.current === startdato) return

    previousStartdato.current = startdato
    setSluttdatoIsInvalid(false)
    if (sluttdatoField.value) {
      void trigger('sluttdato')
    }
  }, [startdato, sluttdatoField.value, trigger])

  const maxSluttdato = startdatoDayjs?.isValid()
    ? getMaxVarighetDato(deltaker, startdatoDayjs.toDate())?.toDate()
    : undefined

  const {
    datepickerProps: datepickerPropsStartdato,
    inputProps: { onBlur: startdatoOnBlur, ...startdatoInputProps }
  } = useDatepicker({
    fromDate: tidligsteStartdato.toDate(),
    defaultSelected: startdatoDayjs?.isValid()
      ? startdatoDayjs.toDate()
      : undefined,
    onValidate: ({ isInvalid }) => setStartdatoIsInvalid(isInvalid),
    onDateChange: (date) => {
      startdatoField.onChange(date ? dayjs(date).format(DATE_FORMAT) : '')
      if (date) {
        setStartdatoIsInvalid(false)
        clearErrors('startdato')
      }
    }
  })

  const {
    datepickerProps: datepickerPropsSluttdato,
    inputProps: { onBlur: sluttdatoOnBlur, ...sluttdatoInputProps }
  } = useDatepicker({
    fromDate: startdatoDayjs?.isValid()
      ? startdatoDayjs.toDate()
      : tidligsteStartdato.toDate(),
    toDate: maxSluttdato ?? undefined,
    defaultSelected: sluttdatoDayjs?.isValid()
      ? sluttdatoDayjs.toDate()
      : undefined,
    onValidate: ({ isInvalid }) => setSluttdatoIsInvalid(isInvalid),
    onDateChange: (date) => {
      sluttdatoField.onChange(date ? dayjs(date).format(DATE_FORMAT) : '')
      if (date) {
        setSluttdatoIsInvalid(false)
        clearErrors('sluttdato')
      }
    }
  })

  const handleSluttdatoBlur = (event: FocusEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    sluttdatoOnBlur?.(event)
    sluttdatoField.onBlur()

    // Behold rå input når feltet er tomt eller DatePicker ikke har en gyldig verdi
    if (inputValue === '' || sluttdatoIsInvalid || !sluttdatoField.value) {
      sluttdatoField.onChange(inputValue)
    }

    void trigger('sluttdato')
  }

  const handleStartdatoBlur = (event: FocusEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    startdatoOnBlur?.(event)
    startdatoField.onBlur()

    // Behold rå input når feltet er tomt eller DatePicker ikke har en gyldig verdi
    if (inputValue === '' || startdatoIsInvalid || !startdatoField.value) {
      startdatoField.onChange(inputValue)
    }

    // Behold eksisterende feil ved ugyldig tekst; trigger ville overskrevet
    // den med formatfeilen
    if (inputValue !== '' && startdatoIsInvalid && errors.startdato) return

    void trigger('startdato')
  }

  return (
    <div>
      <div className="flex gap-4">
        <DatePicker {...datepickerPropsStartdato}>
          <DatePicker.Input
            label="Startdato"
            ref={startdatoField.ref}
            {...startdatoInputProps}
            id="startdato"
            error={!!errors['startdato']?.message}
            aria-describedby="startdato-error"
            size="small"
            onBlur={handleStartdatoBlur}
            disabled={disabled}
          />
        </DatePicker>

        <DatePicker {...datepickerPropsSluttdato}>
          <DatePicker.Input
            label="Sluttdato"
            ref={sluttdatoField.ref}
            {...sluttdatoInputProps}
            id="sluttdato"
            error={!!errors['sluttdato']?.message}
            aria-describedby="sluttdato-error"
            size="small"
            onBlur={handleSluttdatoBlur}
            disabled={disabled}
          />
        </DatePicker>
      </div>
      <div
        className="mt-4"
        id="startdato-error"
        aria-relevant="additions removals"
        aria-live="polite"
      >
        {errors.startdato && (
          <ErrorMessage size="small">{errors.startdato?.message}</ErrorMessage>
        )}
      </div>
      <div
        className="mt-2"
        id="sluttdato-error"
        aria-relevant="additions removals"
        aria-live="polite"
      >
        {errors.sluttdato && (
          <ErrorMessage size="small">{errors.sluttdato?.message}</ErrorMessage>
        )}
      </div>
    </div>
  )
}
