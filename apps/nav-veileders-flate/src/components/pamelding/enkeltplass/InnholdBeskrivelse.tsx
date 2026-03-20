import { Textarea } from '@navikt/ds-react'
import { fjernUgyldigeTegn } from 'deltaker-flate-common'
import { useFormContext } from 'react-hook-form'
import {
  INNHOLD_MAX_TEGN,
  PameldingEnkeltplassFormValues
} from '../../model/PameldingEnkeltplassFormValues'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext'

export const InnholdBeskrivelse = () => {
  const { disabled } = usePameldingFormContext()
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <Textarea
      label="Dette er innholdet"
      {...register('innhold')}
      value={watch('innhold')}
      onChange={(e) => {
        setValue('innhold', fjernUgyldigeTegn(e.target.value), {
          shouldValidate: true
        })
      }}
      error={errors.innhold?.message}
      disabled={disabled}
      maxLength={INNHOLD_MAX_TEGN}
      id="innhold"
      size="small"
    />
  )
}
