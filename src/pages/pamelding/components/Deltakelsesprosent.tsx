import { Radio, RadioGroup, TextField } from '@navikt/ds-react'
import { useFormContext, Controller } from 'react-hook-form'
import { DeltakelsesprosentValg, erGyldigProsent, erGyldigDagerPerUke } from '../../../utils'
import { PameldingFormValues } from '../PameldingSkjema'

export interface DeltakelsesprosentProps {
  deltakelsesprosentValg?: DeltakelsesprosentValg
  deltakelsesprosent?: string
  dagerPerUke?: string
}

export const Deltakelsesprosent = ({
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
                type="text"
                {...register('deltakelsesprosent', {
                  required: 'Deltakelsesprosent må fylles ut',
                  validate: (value) =>
                    (value && erGyldigProsent(value)) ||
                    'Deltakelsesprosent må være et tall fra og med 0 til og med 100'
                })}
                defaultValue={deltakelsesprosent}
                error={errors.deltakelsesprosent?.message}
                aria-required
                required
                id="deltakelsesprosent"
                className="[&>input]:w-16"
              />
              <TextField
                label="Hvor mange dager i uka? (valgfritt)"
                size="small"
                type="text"
                {...register('dagerPerUke', {
                  validate: (value) =>
                    (value && erGyldigDagerPerUke(value)) ||
                    'Antall dager per uke må være et tall fra og med 0 til og med 7'
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
