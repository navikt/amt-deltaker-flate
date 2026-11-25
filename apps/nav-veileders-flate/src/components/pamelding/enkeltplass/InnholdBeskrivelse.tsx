import { Textarea } from '@navikt/ds-react'
import { fjernUgyldigeTegn } from 'deltaker-flate-common'
import { useFormContext } from 'react-hook-form'
import {
  INNHOLD_MAX_TEGN,
  OpplaringKategoriseringFormValues
} from '../../../model/OpplaringKategoriseringFormValues'
import { usePameldingFormContext } from '../PameldingFormContext'

export const InnholdBeskrivelse = ({ className }: { className?: string }) => {
  const { disabled } = usePameldingFormContext()
  const {
    register,
    setValue,
    watch,
    formState: { errors, submitCount }
  } = useFormContext<OpplaringKategoriseringFormValues>()

  return (
    <Textarea
      className={className ?? ''}
      label="Dette er innholdet"
      description="Beskriv innholdet i opplæringen og begrunn hvorfor den er nødvendig og hensiktsmessig."
      {...register('innhold')}
      value={watch('innhold')}
      onChange={(e) => {
        setValue('innhold', fjernUgyldigeTegn(e.target.value), {
          shouldValidate: submitCount > 0
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
