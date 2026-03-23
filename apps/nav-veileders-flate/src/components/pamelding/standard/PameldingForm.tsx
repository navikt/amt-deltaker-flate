import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Heading, Textarea } from '@navikt/ds-react'
import {
  erOpplaringstiltak,
  fjernUgyldigeTegn,
  harBakgrunnsinfo,
  harLopendeOppstart,
  OmKurset,
  Oppmotested,
  skalMeldePaaDirekte,
  Tiltakskode,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  BAKGRUNNSINFORMASJON_MAKS_TEGN,
  generateFormDefaultValues,
  pameldingFormSchema,
  PameldingFormValues
} from '../../../model/PameldingFormValues.ts'
import { usePameldingContext } from '../../tiltak/PameldingContext.tsx'
import { PameldingFormButtons } from '../FormButtons.tsx'
import { usePameldingFormContext } from '../PameldingFormContext.tsx'
import { Deltakelsesprosent } from './Deltakelsesprosent.tsx'
import { Innhold } from './Innhold.tsx'
import { InnholdOgBakgrunn } from './InnholdOgBakgrunn.tsx'
import { FormErrorSummary } from '../FormErrorSummary.tsx'

interface Props {
  className?: string
  focusOnOpen?: boolean
}

export const PameldingForm = ({ className, focusOnOpen }: Props) => {
  const { pamelding } = usePameldingContext()
  const { disabled } = usePameldingFormContext()
  const tiltakskode = pamelding.deltakerliste.tiltakskode

  const defaultValues = generateFormDefaultValues(pamelding)
  const formRef = useRef<HTMLFormElement>(null)

  const methods = useForm<PameldingFormValues>({
    defaultValues,
    resolver: zodResolver(pameldingFormSchema),
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

  const erOpplaringLopendeOppstartDirektePamelding =
    harLopendeOppstart(pamelding.deltakerliste.oppstartstype) &&
    skalMeldePaaDirekte(pamelding.deltakerliste.pameldingstype) &&
    (erOpplaringstiltak(pamelding.deltakerliste.tiltakskode) ||
      pamelding.deltakerliste.tiltakskode === Tiltakskode.JOBBKLUBB)

  return (
    <form
      autoComplete="off"
      className={className}
      ref={formRef}
      tabIndex={-1}
      aria-label="Skjema for påmelding"
    >
      <FormProvider {...methods}>
        <div className="flex flex-col gap-8 mb-4">
          <FormErrorSummary erEnkeltplass={false} />

          <Innhold pamelding={pamelding} isDisabled={disabled} />

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
                disabled={disabled}
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
              <Deltakelsesprosent disabled={disabled} />
            </div>
          )}
          <Oppmotested
            oppmoteSted={pamelding.deltakerliste.oppmoteSted}
            statusType={pamelding.status.type}
          />
          <InnholdOgBakgrunn pamelding={pamelding} isDisabled={disabled} />
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

          <PameldingFormButtons />
        </div>
      </FormProvider>
    </form>
  )
}
