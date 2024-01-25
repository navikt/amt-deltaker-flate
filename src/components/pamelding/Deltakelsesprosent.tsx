import {Radio, RadioGroup, TextField} from '@navikt/ds-react'
import {Controller, useFormContext} from 'react-hook-form'
import {DeltakelsesprosentValg} from '../../utils.ts'
import {PameldingFormValues} from '../../model/PameldingFormValues.ts'

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
              <Controller
                name={'deltakelsesprosent'}
                control={control}
                render={({ field: { onChange } }) => (
                  <TextField
                    label="Deltakelsesprosent:"
                    size="small"
                    disabled={disableForm}
                    defaultValue={deltakelsesprosent}
                    onChange={({ target }) => {
                      const value = target.value.replace(',', '.')
                      onChange(parseFloat(value))
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
                    disabled={disableForm}
                    onChange={({ target }) => {
                      const value = target.value.replace(',', '.')
                      onChange(parseFloat(value))
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
