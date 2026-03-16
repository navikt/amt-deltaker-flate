import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { getDayjsFromString } from '../../../../../packages/deltaker-flate-common/utils/utils'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues'
import { usePameldingFormContext } from './PameldingFormContext'

interface Props {
  label: string
  id: 'startdato' | 'sluttdato'
  defaultSelected?: Date
  fromDate?: Date | null
  toDate?: Date | null
  disabled?: boolean
  className?: string
}

export function FormDatePicker({
  label,
  id,
  fromDate,
  toDate,
  defaultSelected,
  disabled,
  className
}: Props) {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()
  const { errors: contextErrors, setErrors } = usePameldingFormContext()

  const {
    datepickerProps,
    inputProps: { onBlur: datepickerOnBlur, ...datepickerInputProps }
  } = useDatepicker({
    fromDate: fromDate ?? undefined,
    toDate: toDate ?? undefined,
    defaultSelected: defaultSelected ?? undefined,
    onDateChange: async (date) => {
      setValue(id, date, { shouldDirty: true })
      clearErrors('startdato')
      clearErrors('sluttdato')
      setErrors(contextErrors?.filter((error) => error.id !== id))
    }
  })

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = getDayjsFromString(e.target.value)
    if (date?.isValid()) {
      setValue(id, date.toDate(), { shouldDirty: true })
      clearErrors('startdato')
      clearErrors('sluttdato')

      setErrors(contextErrors?.filter((error) => error.id !== id))
    } else if (e.target.value !== '') {
      setErrors([
        ...contextErrors,
        { id, message: 'Ugyldig datofomat: Bruk dd.mm.åååå' }
      ])
    }
  }

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { ref } }) => (
        <DatePicker {...datepickerProps}>
          <DatePicker.Input
            className={className ?? ''}
            label={label}
            ref={ref}
            // value={dateInput}
            {...datepickerInputProps}
            id={id}
            error={
              errors[id]?.message ||
              contextErrors.find((error) => error.id === id)?.message
            }
            size="small"
            onBlur={(event) => {
              datepickerOnBlur?.(event)
              handleDateInputChange(event)
            }}
            // onChange={handleDateInputChange}
            disabled={disabled}
          />
        </DatePicker>
      )}
    />
  )
}
