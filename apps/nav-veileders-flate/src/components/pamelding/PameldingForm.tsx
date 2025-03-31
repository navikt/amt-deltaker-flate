import { zodResolver } from '@hookform/resolvers/zod'
import { Heading, Textarea, VStack } from '@navikt/ds-react'
import {
  ArenaTiltakskode,
  DeltakerStatusType,
  erKursEllerDigitalt,
  fjernUgyldigeTegn,
  INNHOLD_TYPE_ANNET,
  OmKurset
} from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import {
  BAKGRUNNSINFORMASJON_MAKS_TEGN,
  generateFormDefaultValues,
  pameldingFormSchema,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'
import { Deltakelsesprosent } from './Deltakelsesprosent.tsx'
import { FormErrorSummary } from './FormErrorSummary.tsx'
import { Innhold } from './Innhold.tsx'
import { MeldPaDirekteButton } from './MeldPaDirekteButton.tsx'
import { PameldingFormButtons } from './PameldingFormButtons.tsx'
import { PameldingLagring } from './PameldingLagring.tsx'

interface Props {
  pamelding: PameldingResponse
  className?: string
  disabled?: boolean
  focusOnOpen?: boolean
  disableForm?: (disable: boolean) => void
  onCancelUtkast?: () => void
  onDelEndring?: (pamelding: PameldingResponse) => void
}

export const PameldingForm = ({
  pamelding,
  className,
  disabled,
  focusOnOpen,
  disableForm,
  onCancelUtkast,
  onDelEndring
}: Props) => {
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const status = pamelding.status.type
  const skalViseBakgrunnsinfo = !erKursEllerDigitalt(tiltakstype)

  const defaultValues = generateFormDefaultValues(pamelding)
  const formRef = useRef<HTMLFormElement>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(!!disabled)

  const methods = useForm<PameldingFormValues>({
    defaultValues,
    resolver: zodResolver(pameldingFormSchema),
    shouldFocusError: false
  })

  const {
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors }
  } = methods

  const valgteInnhold = watch('valgteInnhold')

  const handleDisableForm = (disable: boolean) => {
    setIsDisabled(disable)
    if (disableForm) {
      disableForm(disable)
    }
  }

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [])

  const onSubmitError = () => {
    errorSummaryRef.current?.focus()
  }

  useEffect(() => {
    if (!valgteInnhold.find((i) => i === INNHOLD_TYPE_ANNET)) {
      clearErrors('innholdAnnetBeskrivelse')
    }
  }, [valgteInnhold])

  return (
    <form
      autoComplete="off"
      className={className}
      ref={formRef}
      tabIndex={-1}
      aria-label="Skjema for påmelding"
    >
      <FormProvider {...methods}>
        <VStack className="p-4 border rounded-sm border-[var(--a-surface-alt-3)] mb-4">
          <FormErrorSummary ref={errorSummaryRef} />

          <Innhold pamelding={pamelding} isDisabled={isDisabled} />
          <OmKurset
            tiltakstype={pamelding.deltakerliste.tiltakstype}
            oppstartstype={pamelding.deltakerliste.oppstartstype}
            startdato={pamelding.deltakerliste.startdato}
            sluttdato={pamelding.deltakerliste.sluttdato}
            visDelMedArrangorInfo
          />

          {skalViseBakgrunnsinfo && (
            <section className="mb-8">
              <Heading size="medium" level="3" className="mb-4">
                Bakgrunnsinfo
              </Heading>
              <Textarea
                label="Er det noe mer du ønsker å informere arrangøren om?"
                description="Skriv en kortfattet oppsummering av relevant historikk og forhold ved personens situasjon
                og behov som kan påvirke deltakelsen på tiltaket."
                {...register('bakgrunnsinformasjon')}
                value={watch('bakgrunnsinformasjon')}
                onChange={(e) => {
                  setValue(
                    'bakgrunnsinformasjon',
                    fjernUgyldigeTegn(e.target.value),
                    { shouldValidate: true }
                  )
                }}
                error={errors.bakgrunnsinformasjon?.message}
                disabled={isDisabled}
                maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
                id="bakgrunnsinformasjon"
                size="small"
              />
            </section>
          )}

          {(tiltakstype === ArenaTiltakskode.VASV ||
            tiltakstype === ArenaTiltakskode.ARBFORB) && (
            <>
              <Heading size="medium" level="3" className="mb-4">
                Deltakelsesmengde
              </Heading>
              <Deltakelsesprosent disabled={isDisabled} />
            </>
          )}

          <PameldingFormButtons
            pamelding={pamelding}
            disabled={isDisabled}
            disableForm={handleDisableForm}
            onCancelUtkast={onCancelUtkast}
            onDelEndring={onDelEndring}
            onSubmitError={onSubmitError}
          />
        </VStack>

        <div className="flex justify-between items-center">
          <MeldPaDirekteButton
            pamelding={pamelding}
            disabled={isDisabled}
            disableForm={handleDisableForm}
            onSubmitError={onSubmitError}
          />

          {status === DeltakerStatusType.KLADD && (
            <PameldingLagring pamelding={pamelding} />
          )}
        </div>
      </FormProvider>
    </form>
  )
}
