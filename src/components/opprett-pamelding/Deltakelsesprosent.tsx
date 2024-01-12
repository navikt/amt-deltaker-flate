
import { Radio, RadioGroup, TextField } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { DeltakelsesprosentValg } from '../../utils.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'

export interface DeltakelsesprosentProps {
  disableForm: boolean
  deltakelsesprosentValg?: DeltakelsesprosentValg
  deltakelsesprosent?: number
  dagerPerUke?: number
}

export const Deltakelsesprosent = ({
  disableForm,
  deltakelsesprosentValg,
  deltakelsesprosent,
  dagerPerUke
}: DeltakelsesprosentProps) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<PameldingFormValues>()

  const nyDeltakelsesprosentValg = watch('deltakelsesprosentValg')

  const onChangeDeltakelsesprosentValg = (value: DeltakelsesprosentValg) => {
    setValue('deltakelsesprosentValg', value, { shouldValidate: true })
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
            disabled={disableForm}
            aria-required
            id="deltakelsesprosentValg"
            onChange={onChangeDeltakelsesprosentValg}
          >
            <Radio value={DeltakelsesprosentValg.JA}>Ja</Radio>
            <Radio value={DeltakelsesprosentValg.NEI}>Nei</Radio>
          </RadioGroup>

          {nyDeltakelsesprosentValg === DeltakelsesprosentValg.NEI && (
            <>
              <TextField
                label="Deltakelsesprosent:"
                size="small"
                disabled={disableForm}
                type="number"
                {...register('deltakelsesprosent', {
                  valueAsNumber: true
                })}
                defaultValue={deltakelsesprosent}
                error={errors.deltakelsesprosent?.message}
                aria-required
                id="deltakelsesprosent"
                className="[&>input]:w-16"
              />
              <TextField
                label="Hvor mange dager i uka? (valgfritt)"
                size="small"
                type="number"
                disabled={disableForm}
                {...register('dagerPerUke', {
                  valueAsNumber: true
                })}
                defaultValue={dagerPerUke}
                error={errors.dagerPerUke?.message}
                className="[&>input]:w-16"
                id="dagerPerUke"
              />
            </>
          )}
        </>
      )}
    />
  )
}
