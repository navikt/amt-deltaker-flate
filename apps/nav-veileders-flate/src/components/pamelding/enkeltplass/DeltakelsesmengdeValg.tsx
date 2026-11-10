import { usePameldingFormContext } from '../PameldingFormContext.tsx'
import { Controller, useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues.ts'
import { NumberTextField } from '../../NumberTextField.tsx'

export const DeltakelsesmengdeValg = () => {
  const { disabled } = usePameldingFormContext()
  const {
    control,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <Controller
      name="dagerPerUke"
      control={control}
      render={({ field: { value, onChange, ref } }) => (
        <NumberTextField
          ref={ref}
          label="Antall dager i uka som personen deltar (valgfritt)"
          value={value ?? undefined}
          onChange={(newValue) => onChange(newValue ?? null)}
          error={errors.dagerPerUke?.message}
          disabled={disabled}
          id="dagerPerUke"
          className="[&>input]:w-16"
        />
      )}
    />
  )
}
