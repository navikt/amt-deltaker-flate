import { BodyLong, Checkbox, CheckboxGroup, Heading, Textarea, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PameldingResponse, Tiltakstype } from '../../api/data/pamelding.ts'
import { BESKRIVELSE_MAX_TEGN, MAL_TYPE_ANNET } from '../../utils.ts'
import {
  BAKGRUNNSINFORMASJON_MAKS_TEGN,
  generateFormDefaultValues,
  pameldingFormSchema,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'
import { Deltakelsesprosent } from './Deltakelsesprosent.tsx'
import { Todo } from '../Todo.tsx'
import { PameldingFormButtons } from './PameldingFormButtons.tsx'
import { useState } from 'react'

interface Props {
  pamelding: PameldingResponse
}

export const PameldingForm = ({ pamelding }: Props) => {
  const mal = pamelding.mal
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const defaultValues = generateFormDefaultValues(pamelding)

  const [disableForm, setDisableForm] = useState<boolean>(false)

  const methods = useForm<PameldingFormValues>({
    defaultValues,
    resolver: zodResolver(pameldingFormSchema),
    shouldFocusError: false
  })

  const {
    register,
    watch,
    formState: { errors }
  } = methods

  const valgteMal = watch('valgteMal')

  return (
    <VStack gap="4" className="p-8 bg-white">
      <section className="space-y-4">
        <Heading size="medium" level="3">
          Hva er innholdet?
        </Heading>
        <BodyLong size="small">
          (<Todo />: Her skal det vel være en tekst til veileder?)
          <br />
          Du får tett oppfølging og støtte av en veileder. Sammen Kartlegger dere hvordan din
          kompetanse , interesser og ferdigheter påvirker muligheten din til å jobbe.
        </BodyLong>
      </section>

      <form autoComplete="off">
        <FormProvider {...methods}>
          <section className="mb-8">
            {mal.length > 0 && (
              <CheckboxGroup
                defaultValue={defaultValues.valgteMal}
                legend="Hva mer skal tiltaket inneholde?"
                error={errors.valgteMal?.message}
                size="small"
                disabled={disableForm}
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
                    label={null}
                    {...register('malAnnetBeskrivelse')}
                    value={watch('malAnnetBeskrivelse')}
                    error={errors.malAnnetBeskrivelse?.message}
                    disabled={disableForm}
                    aria-label={'Beskrivelse av mål "Annet"'}
                    aria-required
                    maxLength={BESKRIVELSE_MAX_TEGN}
                    size="small"
                    id="malAnnetBeskrivelse"
                  />
                )}
              </CheckboxGroup>
            )}
          </section>

          <section className="mb-8">
            <Heading size="medium" level="3" className="mb-4">
              Bakgrunnsinformasjon
            </Heading>
            <Textarea
              label="Er det noe mer dere ønsker å informere arrangøren om?"
              description="Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?"
              {...register('bakgrunnsinformasjon')}
              value={watch('bakgrunnsinformasjon')}
              error={errors.bakgrunnsinformasjon?.message}
              disabled={disableForm}
              maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
              id="bakgrunnsinformasjon"
              size="small"
            />
          </section>

          {(tiltakstype === Tiltakstype.VASV || tiltakstype === Tiltakstype.ARBFORB) && (
            <Deltakelsesprosent
              disableForm={disableForm}
              deltakelsesprosentValg={defaultValues.deltakelsesprosentValg}
              deltakelsesprosent={defaultValues.deltakelsesprosent}
              dagerPerUke={defaultValues.dagerPerUke}
            />
          )}

          <PameldingFormButtons
            pamelding={pamelding}
            disableForm={(disabled) => setDisableForm(disabled)}
          />
        </FormProvider>
      </form>
    </VStack>
  )
}
