import {
  BodyLong,
  Checkbox,
  CheckboxGroup,
  ErrorSummary,
  Heading,
  Textarea,
  VStack
} from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DeltakerStatusType,
  PameldingResponse,
  Tiltakstype
} from '../../api/data/pamelding.ts'
import {
  BAKGRUNNSINFORMASJON_MAKS_TEGN,
  BESKRIVELSE_ANNET_MAX_TEGN,
  generateFormDefaultValues,
  pameldingFormSchema,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'
import { Deltakelsesprosent } from './Deltakelsesprosent.tsx'
import { PameldingFormButtons } from './PameldingFormButtons.tsx'
import { useEffect, useRef, useState } from 'react'
import { INNHOLD_TYPE_ANNET } from '../../utils/utils.ts'
import { MeldPaDirekteButton } from './MeldPaDirekteButton.tsx'
import { PameldingLagring } from './PameldingLagring.tsx'

interface Props {
  pamelding: PameldingResponse
  className?: string
  disabled?: boolean
  focusOnOpen?: boolean
  disableForm?: (disable: boolean) => void
  onCancelUtkast?: () => void
}

export const PameldingForm = ({
  pamelding,
  className,
  disabled,
  focusOnOpen,
  disableForm,
  onCancelUtkast
}: Props) => {
  const errorSummaryWrapper = useRef<HTMLDivElement>(null)
  const innhold = pamelding.deltakelsesinnhold?.innhold ?? []
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const status = pamelding.status.type

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
    watch,
    setFocus,
    formState: { errors }
  } = methods

  const valgteInnhold = watch('valgteInnhold')

  const handleDiableForm = (disable: boolean) => {
    setIsDisabled(disable)
    disableForm && disableForm(disable)
  }

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [])

  const onSubmitError = () => {
    errorSummaryWrapper.current?.focus()
  }

  return (
    <form
      autoComplete="off"
      className={className}
      ref={formRef}
      tabIndex={-1}
      aria-label="Skjema for påmelding"
    >
      <FormProvider {...methods}>
        <VStack className="p-4 border rounded border-[var(--a-surface-alt-3)] mb-4">
          <section className="space-y-4">
            <Heading size="medium" level="3">
              Hva er innholdet?
            </Heading>
            <BodyLong size="small">
              {pamelding.deltakelsesinnhold?.ledetekst ?? ''}
            </BodyLong>
          </section>

          <section className="mb-8 mt-4">
            {innhold.length > 0 && (
              <CheckboxGroup
                defaultValue={defaultValues.valgteInnhold}
                legend="Hva mer skal tiltaket inneholde?"
                error={errors.valgteInnhold?.message}
                size="small"
                disabled={isDisabled}
                aria-required
                id="valgteInnhold"
              >
                {innhold.map((e) => (
                  <div key={e.innholdskode}>
                    <Checkbox
                      key={e.innholdskode}
                      value={e.innholdskode}
                      {...register('valgteInnhold')}
                    >
                      {e.innholdskode === INNHOLD_TYPE_ANNET
                        ? 'Annet - fyll ut'
                        : e.tekst}
                    </Checkbox>
                    {e.innholdskode === INNHOLD_TYPE_ANNET &&
                      valgteInnhold.find((vi) => vi === INNHOLD_TYPE_ANNET) !==
                        undefined && (
                        <Textarea
                          label={null}
                          {...register('innholdAnnetBeskrivelse')}
                          value={watch('innholdAnnetBeskrivelse')}
                          error={errors.innholdAnnetBeskrivelse?.message}
                          disabled={isDisabled}
                          aria-label={'Beskrivelse av mål "Annet"'}
                          aria-required
                          maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
                          size="small"
                          id="innholdAnnetBeskrivelse"
                        />
                      )}
                  </div>
                ))}
              </CheckboxGroup>
            )}
          </section>

          <section className="mb-8">
            <Heading size="medium" level="3" className="mb-4">
              Bakgrunnsinfo
            </Heading>
            <Textarea
              label="Er det noe mer dere ønsker å informere arrangøren om?"
              description="Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?"
              {...register('bakgrunnsinformasjon')}
              value={watch('bakgrunnsinformasjon')}
              error={errors.bakgrunnsinformasjon?.message}
              disabled={isDisabled}
              maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
              id="bakgrunnsinformasjon"
              size="small"
            />
          </section>

          {(tiltakstype === Tiltakstype.VASV ||
            tiltakstype === Tiltakstype.ARBFORB) && (
            <Deltakelsesprosent disabled={isDisabled} />
          )}

          <div ref={errorSummaryWrapper} tabIndex={-1}>
            {Object.keys(errors).length > 0 && (
              <ErrorSummary heading="Du må fikse disse feilene før du kan opprette påmeldingen.">
                {(
                  [
                    'valgteInnhold',
                    'innholdAnnetBeskrivelse',
                    'bakgrunnsinformasjon',
                    'deltakelsesprosent',
                    'dagerPerUke'
                  ] as const
                ).map((errorName) => {
                  const error = errors[errorName]

                  return (
                    error && (
                      <ErrorSummary.Item
                        key={errorName}
                        as="button"
                        type="button"
                        onClick={() => setFocus(errorName)}
                      >
                        {error.message}
                      </ErrorSummary.Item>
                    )
                  )
                })}
              </ErrorSummary>
            )}
          </div>

          <PameldingFormButtons
            pamelding={pamelding}
            disabled={isDisabled}
            disableForm={handleDiableForm}
            onCancelUtkast={onCancelUtkast}
            onSubmitError={onSubmitError}
          />
        </VStack>

        <div className="flex justify-between items-center">
          <MeldPaDirekteButton
            pamelding={pamelding}
            disabled={isDisabled}
            disableForm={handleDiableForm}
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
