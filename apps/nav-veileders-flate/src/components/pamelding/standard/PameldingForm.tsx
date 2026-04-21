import { zodResolver } from '@hookform/resolvers/zod'
import { Heading, InfoCard, Textarea } from '@navikt/ds-react'
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
import { useDeltakerContext } from '../../tiltak/DeltakerContext.tsx'
import { PameldingFormButtons } from '../FormButtons.tsx'
import { FormErrorSummary } from '../FormErrorSummary.tsx'
import { usePameldingFormContext } from '../PameldingFormContext.tsx'
import { Deltakelsesprosent } from './Deltakelsesprosent.tsx'
import { Innhold } from './Innhold.tsx'
import { InnholdOgBakgrunn } from './InnholdOgBakgrunn.tsx'
import { InformationSquareIcon } from '@navikt/aksel-icons'

interface Props {
  className?: string
  focusOnOpen?: boolean
}

export const PameldingForm = ({ className, focusOnOpen }: Props) => {
  const { deltaker } = useDeltakerContext()
  const { disabled } = usePameldingFormContext()
  const tiltakskode = deltaker.deltakerliste.tiltakskode

  const defaultValues = generateFormDefaultValues(deltaker)
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

  const visVedtaksvarselVedDirektePamelding =
    harLopendeOppstart(deltaker.deltakerliste.oppstartstype) &&
    skalMeldePaaDirekte(deltaker.deltakerliste.pameldingstype) &&
    (erOpplaringstiltak(deltaker.deltakerliste.tiltakskode) ||
      deltaker.deltakerliste.tiltakskode === Tiltakskode.JOBBKLUBB ||
      deltaker.deltakerliste.tiltakskode === Tiltakskode.TILPASSET_JOBBSTOTTE)

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

          <Innhold pamelding={deltaker} isDisabled={disabled} />

          <OmKurset
            tiltakskode={deltaker.deltakerliste.tiltakskode}
            statusType={deltaker.status.type}
            oppstartstype={deltaker.deltakerliste.oppstartstype}
            pameldingstype={deltaker.deltakerliste.pameldingstype}
            erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
            startdato={deltaker.deltakerliste.startdato}
            sluttdato={deltaker.deltakerliste.sluttdato}
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
            oppmoteSted={deltaker.deltakerliste.oppmoteSted}
            statusType={deltaker.status.type}
          />

          <InnholdOgBakgrunn pamelding={deltaker} isDisabled={disabled} />

          {visVedtaksvarselVedDirektePamelding && (
            <InfoCard data-color="info" size="small">
              <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                <InfoCard.Title>
                  Ved å fullføre denne påmeldingen fatter du også vedtaket om
                  tiltaksplass
                </InfoCard.Title>
              </InfoCard.Header>
              <InfoCard.Content>
                Nav gjør ingen ytterligere vurdering av om deltakeren oppfyller
                kravene for å delta i tiltaket. Deltakeren får vedtak og
                informasjonen deles med arrangøren.
              </InfoCard.Content>
            </InfoCard>
          )}

          <PameldingFormButtons />
        </div>
      </FormProvider>
    </form>
  )
}
