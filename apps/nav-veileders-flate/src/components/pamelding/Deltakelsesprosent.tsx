import { Radio, RadioGroup } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { DeltakelsesprosentValg } from '../../utils/utils.ts'
import { NumberTextField } from '../NumberTextField.tsx'

export interface DeltakelsesprosentProps {
  disabled: boolean
}

export const Deltakelsesprosent = ({ disabled }: DeltakelsesprosentProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<PameldingFormValues>()

  const deltakelsesprosentValg = watch('deltakelsesprosentValg')
  const deltakelsesprosent = watch('deltakelsesprosent')
  const dagerPerUke = watch('dagerPerUke')

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
            legend="Skal personen delta 100&nbsp;% i tiltaket?"
            defaultValue={deltakelsesprosentValg}
            size="small"
            disabled={disabled}
            required
            id="deltakelsesprosentValg"
            onChange={onChangeDeltakelsesprosentValg}
          >
            <Radio value={DeltakelsesprosentValg.JA}>Ja</Radio>
            <Radio value={DeltakelsesprosentValg.NEI}>Nei</Radio>
          </RadioGroup>

          {deltakelsesprosentValg === DeltakelsesprosentValg.NEI && (
            <>
              <Controller
                name={'deltakelsesprosent'}
                control={control}
                render={({ field: { onChange, ref } }) => (
                  <NumberTextField
                    ref={ref}
                    label="Deltakelsesprosent:"
                    disabled={disabled}
                    value={deltakelsesprosent}
                    onChange={onChange}
                    error={errors.deltakelsesprosent?.message}
                    required
                    id="deltakelsesprosent"
                    className="[&>input]:w-16 mt-4"
                  />
                )}
              />
              <Controller
                name={'dagerPerUke'}
                control={control}
                render={({ field: { onChange, ref } }) => (
                  <NumberTextField
                    ref={ref}
                    label="Hvor mange dager i uka? (valgfritt)"
                    disabled={disabled}
                    value={dagerPerUke}
                    onChange={onChange}
                    error={errors.dagerPerUke?.message}
                    className="[&>input]:w-16 mt-4"
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
