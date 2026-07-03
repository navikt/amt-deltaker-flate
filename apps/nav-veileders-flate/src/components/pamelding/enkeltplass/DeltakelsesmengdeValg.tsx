import { usePameldingFormContext } from '../PameldingFormContext.tsx'
import { useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues.ts'
import { TextField } from '@navikt/ds-react'

export const DeltakelsesmengdeValg = () => {
  const { disabled } = usePameldingFormContext()
  const {
    register,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <TextField
      label="Antall dager i uka som personen deltar (valgfritt)"
      description="Fyll ut hvis personen skal søke om tiltakspenger eller tilleggsstønader"
      inputMode="numeric"
      {...register('dagerPerUke', {
        setValueAs: (value) => {
          if (value === null || value === undefined) {
            return null
          }
          const trimmed = String(value).trim()
          return trimmed.length === 0 ? null : Number(trimmed)
        }
      })}
      error={errors.dagerPerUke?.message}
      disabled={disabled}
      maxLength={1}
      id="dagerPerUke"
      size="small"
      className="[&>input]:w-16"
    />
  )
}
