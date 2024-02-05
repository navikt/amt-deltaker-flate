import {Radio, RadioGroup, TextField} from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import {PameldingFormValues} from '../../model/PameldingFormValues.ts'
import { DeltakelsesprosentValg } from '../../utils/utils.ts'

export interface DeltakelsesprosentProps {
  disabled: boolean
  deltakelsesprosentValg?: DeltakelsesprosentValg
  deltakelsesprosent?: number
  dagerPerUke?: number
}

export const Deltakelsesprosent = ({
  disabled,
  deltakelsesprosentValg,
  deltakelsesprosent,
  dagerPerUke
}: DeltakelsesprosentProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<PameldingFormValues>()

  const nyDeltakelsesprosentValg = watch('deltakelsesprosentValg')

  const onChangeDeltakelsesprosentValg = (value: DeltakelsesprosentValg) => {
    setValue('deltakelsesprosentValg', value, { shouldValidate: true })
    if (value === DeltakelsesprosentValg.JA) {
      setValue('deltakelsesprosent', undefined)
      setValue('dagerPerUke', undefined)
    }
  }

  return (
    <Controller
      name="deltakelsesprosentValg"
      control={control}
      render={() => (
        <>
          <RadioGroup
            legend="Skal personen delta 100%?"
            error={errors.deltakelsesprosentValg?.message}
            defaultValue={deltakelsesprosentValg}
            size="small"
            disabled={disabled}
            aria-required
            id="deltakelsesprosentValg"
            onChange={onChangeDeltakelsesprosentValg}
          >
            <Radio value={DeltakelsesprosentValg.JA}>Ja</Radio>
            <Radio value={DeltakelsesprosentValg.NEI}>Nei</Radio>
          </RadioGroup>

          {nyDeltakelsesprosentValg === DeltakelsesprosentValg.NEI && (
            <>
              <Controller
                name={'deltakelsesprosent'}
                control={control}
                render={({ field: { onChange } }) => (
                  <TextField
                    label="Deltakelsesprosent:"
                    size="small"
                    disabled={disabled}
                    defaultValue={deltakelsesprosent}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={({ target }) => {
                      const value = target.value.replace(',', '.')
                      onChange(value.length > 0 ? parseFloat(value) : undefined)
                    }}
                    error={errors.deltakelsesprosent?.message}
                    aria-required
                    id="deltakelsesprosent"
                    className="[&>input]:w-16"
                  />
                )}
              />
              <Controller
                name={'dagerPerUke'}
                control={control}
                render={({ field: { onChange } }) => (
                  <TextField
                    label="Hvor mange dager i uka? (valgfritt)"
                    size="small"
                    defaultValue={dagerPerUke}
                    disabled={disabled}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={({ target }) => {
                      const value = target.value.replace(',', '.')
                      onChange(value.length > 0 ? parseFloat(value) : undefined)
                    }}
                    error={errors.dagerPerUke?.message}
                    className="[&>input]:w-16"
                    id="dagerPerUke"
                  />
                )}
              />
            </>
          )}
        </>
      )}
    />
  )
}
