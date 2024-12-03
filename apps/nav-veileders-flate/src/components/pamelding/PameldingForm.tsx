import { zodResolver } from '@hookform/resolvers/zod'
import {
  BodyLong,
  Checkbox,
  CheckboxGroup,
  Heading,
  Textarea,
  VStack
} from '@navikt/ds-react'
import {
  DeltakerStatusType,
  fjernUgyldigeTegn,
  INNHOLD_TYPE_ANNET,
  Tiltakstype
} from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import {
  BAKGRUNNSINFORMASJON_MAKS_TEGN,
  BESKRIVELSE_ANNET_MAX_TEGN,
  PameldingFormValues,
  erInnholdPakrevd,
  generateFormDefaultValues,
  pameldingFormSchema
} from '../../model/PameldingFormValues.ts'
import { Deltakelsesprosent } from './Deltakelsesprosent.tsx'
import { FormErrorSummary } from './FormErrorSummary.tsx'
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
  const innhold = pamelding.deltakerliste.tilgjengeligInnhold
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const status = pamelding.status.type
  const skalViseInnholdSjekkbokser = erInnholdPakrevd(tiltakstype)

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

  const handleDiableForm = (disable: boolean) => {
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
        <VStack className="p-4 border rounded border-[var(--a-surface-alt-3)] mb-4">
          <FormErrorSummary ref={errorSummaryRef} />

          <section>
            <Heading size="medium" level="3">
              Dette er innholdet
            </Heading>
            {pamelding.deltakelsesinnhold?.ledetekst && (
              <BodyLong size="small">
                {pamelding.deltakelsesinnhold.ledetekst}
              </BodyLong>
            )}
          </section>

          {tiltakstype === Tiltakstype.VASV && (
            <section className="mb-8 mt-4">
              <Textarea
                label="Her kan du beskrive hva slags arbeidsoppgaver ol. tiltaket kan inneholde (valgfritt)"
                {...register('innholdsTekst')}
                onChange={(e) => {
                  setValue('innholdsTekst', fjernUgyldigeTegn(e.target.value), {
                    shouldValidate: true
                  })
                }}
                value={watch('innholdsTekst')}
                error={errors.innholdAnnetBeskrivelse?.message}
                disabled={isDisabled}
                aria-label="Annet innhold beskrivelse"
                aria-required
                maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
                size="small"
                id="innholdAnnetBeskrivelse"
              />
            </section>
          )}
          {skalViseInnholdSjekkbokser && innhold.innhold.length > 0 && (
            <section className="mb-8 mt-4">
              <CheckboxGroup
                defaultValue={defaultValues.valgteInnhold}
                legend="Hva mer skal tiltaket inneholde?"
                error={errors.valgteInnhold?.message}
                size="small"
                disabled={isDisabled}
                id="valgteInnhold"
              >
                {innhold.innhold.map((e) => (
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
                          onChange={(e) => {
                            setValue(
                              'innholdAnnetBeskrivelse',
                              fjernUgyldigeTegn(e.target.value),
                              { shouldValidate: true }
                            )
                          }}
                          error={errors.innholdAnnetBeskrivelse?.message}
                          disabled={isDisabled}
                          aria-label="Annet innhold beskrivelse"
                          aria-required
                          maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
                          size="small"
                          id="innholdAnnetBeskrivelse"
                        />
                      )}
                  </div>
                ))}
              </CheckboxGroup>
            </section>
          )}

          {tiltakstype !== Tiltakstype.DIGIOPPARB && (
            <section className="mb-8">
              <Heading size="medium" level="3" className="mb-4">
                Bakgrunnsinfo
              </Heading>
              <Textarea
                label="Er det noe mer dere ønsker å informere arrangøren om?"
                description="Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?"
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

          {(tiltakstype === Tiltakstype.VASV ||
            tiltakstype === Tiltakstype.ARBFORB) && (
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
            disableForm={handleDiableForm}
            onCancelUtkast={onCancelUtkast}
            onDelEndring={onDelEndring}
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
