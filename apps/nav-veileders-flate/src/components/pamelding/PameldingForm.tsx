import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Heading, Textarea } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  erOpplaringstiltak,
  fjernUgyldigeTegn,
  harBakgrunnsinfo,
  INNHOLD_TYPE_ANNET,
  skalMeldePaaDirekte,
  OmKurset,
  Oppmotested,
  Oppstartstype,
  visDeltakelsesmengde
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
import { InnholdOgBakgrunn } from './InnholdOgBakgrunn.tsx'
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
  const tiltakskode = pamelding.deltakerliste.tiltakskode
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

  const erOpplaringLopendeOppstartDirektePamelding =
    pamelding.deltakerliste.oppstartstype === Oppstartstype.LOPENDE &&
    erOpplaringstiltak(pamelding.deltakerliste.tiltakskode) &&
    skalMeldePaaDirekte(pamelding.deltakerliste.pameldingstype)

  return (
    <form
      autoComplete="off"
      className={className}
      ref={formRef}
      tabIndex={-1}
      aria-label="Skjema for påmelding"
    >
      <FormProvider {...methods}>
        <div className="flex flex-col gap-8 p-4 border rounded-sm border-(--a-surface-alt-3) mb-4">
          <FormErrorSummary ref={errorSummaryRef} />

          <Innhold pamelding={pamelding} isDisabled={isDisabled} />

          <OmKurset
            tiltakskode={pamelding.deltakerliste.tiltakskode}
            statusType={pamelding.status.type}
            oppstartstype={pamelding.deltakerliste.oppstartstype}
            pameldingstype={pamelding.deltakerliste.pameldingstype}
            startdato={pamelding.deltakerliste.startdato}
            sluttdato={pamelding.deltakerliste.sluttdato}
            visDelMedArrangorInfo
          />

          {harBakgrunnsinfo(tiltakskode) && (
            <section>
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

          {visDeltakelsesmengde(tiltakskode) && (
            <div>
              <Heading size="medium" level="3" className="mb-4">
                Deltakelsesmengde
              </Heading>
              <Deltakelsesprosent disabled={isDisabled} />
            </div>
          )}

          <Oppmotested
            oppmoteSted={pamelding.deltakerliste.oppmoteSted}
            statusType={pamelding.status.type}
          />

          <InnholdOgBakgrunn pamelding={pamelding} isDisabled={isDisabled} />

          {erOpplaringLopendeOppstartDirektePamelding && (
            <Alert variant="info" size="small">
              <Heading size="xsmall" level="3">
                Ved å fullføre denne påmeldingen fatter du også vedtaket om
                tiltaksplass
              </Heading>
              Nav gjør ingen ytterligere vurdering av om deltakeren oppfyller
              kravene for å delta i tiltaket. Deltakeren får vedtak og
              informasjonen deles med arrangøren.
            </Alert>
          )}

          <PameldingFormButtons
            pamelding={pamelding}
            disabled={isDisabled}
            disableForm={handleDisableForm}
            onCancelUtkast={onCancelUtkast}
            onDelEndring={onDelEndring}
            onSubmitError={onSubmitError}
          />
        </div>

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
