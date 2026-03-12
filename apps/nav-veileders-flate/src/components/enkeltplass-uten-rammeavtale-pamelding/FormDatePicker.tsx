import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues'
import { formatDateToString } from '../../utils/utils'
import dayjs from 'dayjs'

interface Props {
  label: string
  id: 'startDato' | 'sluttDato'
  defaultSelected?: string
  disabled?: boolean
  className?: string
}

export function FormDatePicker({
  label,
  id,
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

  const {
    datepickerProps,
    inputProps: { onBlur: datepickerOnBlur, ...datepickerInputProps }
  } = useDatepicker({
    fromDate: new Date(),
    defaultSelected: defaultSelected
      ? dayjs(defaultSelected).toDate()
      : undefined,
    onDateChange: (date) => {
      setValue(id, formatDateToString(date), { shouldDirty: true })
      clearErrors(id)
    }
  })

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, e.target.value, { shouldDirty: true })

    const date = dayjs(e.target.value, 'D.M.YY', true)
    if (date.isValid()) {
      setValue(id, formatDateToString(date.toDate()), { shouldDirty: true })
      const isAfter = date.isAfter(dayjs())
      if (isAfter) {
        // Bare fjern feilmeldinger, ikke setter dem
        clearErrors(id)
      }
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
            {...datepickerInputProps}
            id={id}
            error={errors[id]?.message}
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
