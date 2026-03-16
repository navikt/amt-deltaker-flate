import { DatePicker, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Controller, useFormContext } from 'react-hook-form'
import { getDayjsFromString } from '../../../../../packages/deltaker-flate-common/utils/utils'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues'

interface Props {
  label: string
  id: 'startdato' | 'sluttdato'
  defaultSelected?: string | null
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

  const {
    datepickerProps,
    inputProps: { onBlur: datepickerOnBlur, ...datepickerInputProps }
  } = useDatepicker({
    fromDate: fromDate ?? undefined,
    toDate: toDate ?? undefined,
    defaultSelected: getDayjsFromString(defaultSelected)?.toDate() ?? undefined,
    onDateChange: async (date) => {
      setValue(id, dayjs(date).format('DD.MM.YYYY'), { shouldDirty: true })
      clearErrors('startdato')
      clearErrors('sluttdato')
    }
  })

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, e.target.value, { shouldDirty: true })
    const date = getDayjsFromString(e.target.value)
    if (date?.isValid()) {
      setValue(id, date.format('DD.MM.YYYY'), { shouldDirty: true })
      clearErrors('startdato')
      clearErrors('sluttdato')
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
