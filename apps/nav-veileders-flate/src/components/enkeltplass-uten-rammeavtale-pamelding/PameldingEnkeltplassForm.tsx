import { zodResolver } from '@hookform/resolvers/zod'
import { InfoCard, Textarea } from '@navikt/ds-react'
import { fjernUgyldigeTegn } from 'deltaker-flate-common'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  createPameldingEnkeltplassFormSchema,
  generateFormDefaultValues,
  PameldingEnkeltplassFormValues,
  TEKSTFELT_MAX_TEGN
} from '../../model/PameldingEnkeltplassFormValues'
import { usePameldingContext } from '../tiltak/PameldingContext'
import { PameldingDatoer } from './PameldingDatoer'
import { FormErrorSummary } from './FormErrorSummary'
import { PameldingFormButtons } from './PameldingFormButtons'
import { usePameldingFormContext } from './PameldingFormContext'

interface Props {
  className?: string
  focusOnOpen?: boolean
}

export const PameldingEnkeltplassForm = ({ className, focusOnOpen }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)

  const { disabled } = usePameldingFormContext()
  const { pamelding } = usePameldingContext()
  const defaultValues = generateFormDefaultValues(pamelding)

  const methods = useForm<PameldingEnkeltplassFormValues>({
    defaultValues,
    resolver: zodResolver(createPameldingEnkeltplassFormSchema(pamelding)),
    shouldFocusError: false
  })

  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = methods

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [])

  return (
    <form
      autoComplete="off"
      className={className}
      ref={formRef}
      tabIndex={-1}
      aria-label="Skjema for påmelding"
    >
      <FormProvider {...methods}>
        <FormErrorSummary />

        <Textarea
          label="Beskrivelse av kurset og ønsket utfall"
          {...register('beskrivelse')}
          value={watch('beskrivelse')}
          onChange={(e) => {
            setValue('beskrivelse', fjernUgyldigeTegn(e.target.value), {
              shouldValidate: true
            })
          }}
          error={errors.beskrivelse?.message}
          disabled={disabled}
          maxLength={TEKSTFELT_MAX_TEGN}
          id="beskrivelse"
          size="small"
        />

        <PameldingDatoer
          className="mt-4"
          defaultStartdato={defaultValues.startdato}
          defaultSluttdato={defaultValues.startdato}
        />

        <Textarea
          className="mt-16"
          label="Prisinformasjon"
          description="Før opp kostnader for Nav utenom tilleggsstønader og ytelser"
          {...register('prisinformasjon')}
          value={watch('prisinformasjon')}
          onChange={(e) => {
            setValue('prisinformasjon', fjernUgyldigeTegn(e.target.value), {
              shouldValidate: true
            })
          }}
          error={errors.prisinformasjon?.message}
          disabled={disabled}
          maxLength={TEKSTFELT_MAX_TEGN}
          id="prisinformasjon"
          size="small"
        />

        <InfoCard className="mt-8">
          <InfoCard.Header>
            <InfoCard.Title>
              Prisinformasjonen sendes til godkjenning.
            </InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            Hvis tiltaksøkonomien godkjennes så fattes vedtaket, og brukeren
            blir varslet.
          </InfoCard.Content>
        </InfoCard>

        <PameldingFormButtons className="mt-8" />
      </FormProvider>
    </form>
  )
}
