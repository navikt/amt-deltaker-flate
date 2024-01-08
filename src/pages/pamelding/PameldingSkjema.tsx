import {
  Button,
  Checkbox,
  CheckboxGroup,
  ErrorSummary,
  HStack,
  Textarea,
  VStack
} from '@navikt/ds-react'
import { Tiltakstype, type Mal } from '../../api/data/pamelding'
import { useState } from 'react'
import { MeldPaDirekteModal } from './components/MeldPaDirekteModal'
import { BAKGRUNNSINFO_MAX_TEGN, BESKRIVELSE_MAX_TEGN, MAL_TYPE_ANNET } from '../../utils'
import { Deltakelsesprosent } from './components/Deltakelsesprosent'
import { FormProvider, useForm } from 'react-hook-form'
import { DeltakelsesprosentValg } from '../../utils'
// import { z } from 'zod'

export interface PameldingSkjemaProps {
  tiltakstype: Tiltakstype
  mal: Array<Mal>
  bakgrunnsinformasjon?: string
  deltakelsesprosent?: number
  dagerPerUke?: number
}

/*
const schema = z.object({
  valgteMal: z.array(z.string({ required_error: 'Du må velge minst ett mål med deltakelsen' })),
  malAnnetBeskrivelse: z
    .string({ required_error: 'Du må fylle ut beskrivelse for mål "Annet"' })
    .max(BESKRIVELSE_MAX_TEGN, `Beskrivelsen kan bare bestå av ${BESKRIVELSE_MAX_TEGN} tegn`),
  bakgrunnsinformasjon: z
    .string()
    .max(
      BAKGRUNNSINFO_MAX_TEGN,
      `Bakgrunnsinformasjon kan bare bestå av ${BAKGRUNNSINFO_MAX_TEGN} tegn`
    )
    .optional()
    .nullable(),
  deltakelsesprosentValg: z.nativeEnum(DeltakelsesprosentValg, {
    required_error: 'Du må velge om deltkaer skal delta 100 % eller ikke'
  }),
  deltakelsesprosent: z.string(),
  dagerPerUke: z.string().optional().nullable()
})

export type PameldingFormValues = z.infer<typeof schema>
*/

export type PameldingFormValues = {
  valgteMal: string[]
  malAnnetBeskrivelse?: string
  bakgrunnsinformasjon?: string
  deltakelsesprosentValg?: DeltakelsesprosentValg
  deltakelsesprosent?: string
  dagerPerUke?: string
}

export const PameldingSkjema = ({
  tiltakstype,
  mal,
  bakgrunnsinformasjon,
  deltakelsesprosent,
  dagerPerUke
}: PameldingSkjemaProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const defaultValues: PameldingFormValues = {
    valgteMal: mal.filter((e) => e.valgt).map((e) => e.type),
    bakgrunnsinformasjon: bakgrunnsinformasjon,
    deltakelsesprosentValg: deltakelsesprosent ? DeltakelsesprosentValg.JA : undefined, // TODO, skal denne sendes til backend? Eller skal vi anta at den er satt hvis vi har noen valgte mål, mens den ikke er satt hvis vi ikke har det
    deltakelsesprosent: deltakelsesprosent?.toString(),
    dagerPerUke: dagerPerUke?.toString()
  }

  const methods = useForm<PameldingFormValues>({
    defaultValues,
    // resolver: zodResolver(schema),
    shouldFocusError: false
  })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = methods

  const valgteMal = watch('valgteMal')

  const meldPaDirekte = () => {
    handleSubmit(() => {
      if (isValid) {
        setModalOpen(true)
        // TODO send request
      }
    })
  }

  const sendSomForslag = () => {
    handleSubmit(() => {
      if (isValid) {
        // TODO lage info-modal for send forslag
        // TODO send request
      }
    })
  }

  return (
    <VStack gap="8">
      <FormProvider {...methods}>
        <CheckboxGroup
          defaultValue={defaultValues.valgteMal}
          legend="Hva er målet med deltakelsen?"
          error={errors.valgteMal?.message}
          size="small"
          aria-required
          id="valgteMal"
        >
          {mal.map((e) => (
            <Checkbox key={e.type} value={e.type} {...register('valgteMal')}>
              {e.visningstekst}
            </Checkbox>
          ))}
          {valgteMal.find((e) => e === MAL_TYPE_ANNET) && (
            <Textarea
              minRows={1}
              rows={1}
              size="small"
              label={null}
              {...register('malAnnetBeskrivelse', {
                maxLength: {
                  value: BESKRIVELSE_MAX_TEGN,
                  message: `Beskrivelsen kan bare bestå av ${BESKRIVELSE_MAX_TEGN} tegn`
                },
                required: 'Du må fylle ut beskrivelse for mål "Annet"'
              })}
              defaultValue={defaultValues.malAnnetBeskrivelse}
              error={errors.malAnnetBeskrivelse?.message}
              maxLength={BESKRIVELSE_MAX_TEGN}
              aria-label={'Beskrivelse av mål "Annet"'}
              aria-required
              id="malAnnetBeskrivelse"
            />
          )}
        </CheckboxGroup>

        <Textarea
          label="Bakgrunnsinformasjon (valgfritt)"
          description="Hvis det er noe viktig med brukers livssituasjon som kommer til å påvirke deltakelsen på tiltaket kan du skrive dette her. Dette vises til bruker og tiltaksarrangør."
          {...register('bakgrunnsinformasjon', {
            maxLength: {
              value: BAKGRUNNSINFO_MAX_TEGN,
              message: `Beskrivelsen kan bare bestå av ${BAKGRUNNSINFO_MAX_TEGN} tegn`
            }
          })}
          defaultValue={defaultValues.bakgrunnsinformasjon}
          error={errors.bakgrunnsinformasjon?.message}
          size="small"
          id="bakgrunnsinformasjon"
          maxLength={BAKGRUNNSINFO_MAX_TEGN}
          minRows={1}
          rows={1}
        />

        {(tiltakstype === Tiltakstype.VASV || tiltakstype === Tiltakstype.ARBFORB) && (
          <Deltakelsesprosent
            deltakelsesprosentValg={defaultValues.deltakelsesprosentValg}
            deltakelsesprosent={defaultValues.deltakelsesprosent}
            dagerPerUke={defaultValues.dagerPerUke}
          />
        )}

        {Object.keys(errors).length > 0 && (
          <ErrorSummary size="small" heading="For å gå videre må du rette opp følgende feil:">
            {Object.entries(errors).map(([key, value]) => {
              const refId = (value.ref as HTMLElement).id ?? (value.ref as { name: string }).name
              return (
                <ErrorSummary.Item href={`#${refId}`} key={key}>
                  {value.message}
                </ErrorSummary.Item>
              )
            })}
          </ErrorSummary>
        )}

        <MeldPaDirekteModal open={modalOpen} onClose={() => setModalOpen(false)} />
        <HStack gap="4">
          <Button size="small" onClick={sendSomForslag}>
            Send forslag til bruker
          </Button>
          <Button size="small" variant="secondary" onClick={meldPaDirekte}>
            Meld på uten å sende et forslag
          </Button>
        </HStack>
      </FormProvider>
    </VStack>
  )
}
