import {Button, Checkbox, CheckboxGroup, Heading, HelpText, Textarea, VStack} from '@navikt/ds-react'
import {FormProvider, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {type Mal, Tiltakstype} from '../../api/data/pamelding.ts'
import {MAL_TYPE_ANNET} from '../../utils.ts'
import {pameldingFormSchema, PameldingFormValues} from '../../model/PameldingFormValues.ts'
import {Deltakelsesprosent} from './Deltakelsesprosent.tsx'
import {Todo} from '../Todo.tsx'

interface Props {
    disableButtonsAndForm: boolean
    onSendSomForslag: (data: PameldingFormValues) => void
    sendSomForslagLoading: boolean
    onSendDirekte: (data: PameldingFormValues) => void
    sendDirekteLoading: boolean
    tiltakstype: Tiltakstype
    defaultValues: PameldingFormValues
    mal: Array<Mal>
    bakgrunnsinformasjon?: string
    deltakelsesprosent?: number
    dagerPerUke?: number
}

export const PameldingForm = ({
  disableButtonsAndForm,
  onSendSomForslag,
  sendSomForslagLoading,
  onSendDirekte,
  sendDirekteLoading,
  tiltakstype,
  mal,
  defaultValues
}: Props) => {
  const FORSLAG_BTN_ID = 'sendSomForslagBtn'
  const DIREKTE_BTN_ID = 'sendDirekteBtn'

  const methods = useForm<PameldingFormValues>({
    defaultValues,
    resolver: zodResolver(pameldingFormSchema),
    shouldFocusError: false,
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = methods

  const handleFormSubmit =
    (submitType: 'sendSomForslagBtn' | 'sendDirekteBtn') => (data: PameldingFormValues) => {
      if (submitType === FORSLAG_BTN_ID) {
        onSendSomForslag(data)
      } else if (submitType === DIREKTE_BTN_ID) {
        onSendDirekte(data)
      } else {
        throw new Error(`no handler for ${submitType}`)
      }
    }

  const valgteMal = watch('valgteMal')

  return (
    <VStack gap="8" className="p-6 bg-white">
      <section className="space-y-4">
        <Heading size="small" level="3">
          Hva er innholdet?
        </Heading>
        <p>
          (<Todo />: Her skal det vel være en tekst til veileder?)
          <br />
          Du får tett oppfølging og støtte av en veileder. Sammen Kartlegger dere hvordan din
          kompetanse , interesser og ferdigheter påvirker muligheten din til å jobbe.
        </p>
      </section>

      <form>
        <FormProvider {...methods}>
          <section className="mb-4">
            {mal.length > 0 && (
              <CheckboxGroup
                defaultValue={defaultValues.valgteMal}
                legend="Hva er målet med deltakelsen?"
                error={errors.valgteMal?.message}
                size="small"
                disabled={disableButtonsAndForm}
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
                    defaultValue={defaultValues.malAnnetBeskrivelse}
                    error={errors.malAnnetBeskrivelse?.message}
                    disabled={disableButtonsAndForm}
                    aria-label={'Beskrivelse av mål "Annet"'}
                    aria-required
                    maxLength={50}
                    id="malAnnetBeskrivelse"
                  />
                )}
              </CheckboxGroup>
            )}
          </section>

          <section className="mb-4">
            <Textarea
              label="Bakgrunnsinformasjon (valgfritt)"
              description="Hvis det er noe viktig med brukers livssituasjon som kommer til å påvirke deltakelsen på tiltaket kan du skrive dette her. Dette vises til bruker og tiltaksarrangør."
              {...register('bakgrunnsinformasjon')}
              value={watch('bakgrunnsinformasjon')}
              error={errors.bakgrunnsinformasjon?.message}
              disabled={disableButtonsAndForm}
              maxLength={500}
              id="bakgrunnsinformasjon"
            />
          </section>

          {(tiltakstype === Tiltakstype.VASV || tiltakstype === Tiltakstype.ARBFORB) && (
            <Deltakelsesprosent
              disableForm={disableButtonsAndForm}
              deltakelsesprosentValg={defaultValues.deltakelsesprosentValg}
              deltakelsesprosent={defaultValues.deltakelsesprosent}
              dagerPerUke={defaultValues.dagerPerUke}
            />
          )}

          <VStack gap="4" className="mt-4">
            <div className="flex items-center">
              <Button
                size="small"
                loading={sendSomForslagLoading}
                disabled={disableButtonsAndForm}
                type="button"
                onClick={handleSubmit(handleFormSubmit(FORSLAG_BTN_ID))}
              >
                Del utkast og gjør klar vedtaket
              </Button>
              <div className="ml-4">
                <HelpText>
                  Når utkastet deles med bruker så kan de lese gjennom hva du foreslår å sende til
                  arrangøren. Bruker blir varslet og kan finne lenke på innlogget nav.no og gjennom
                  aktivitetsplanen. Når bruker godtar så blir vedtaket satt.
                </HelpText>
              </div>
            </div>

            <div className="flex items-center">
              <Button
                size="small"
                variant="secondary"
                loading={sendDirekteLoading}
                disabled={disableButtonsAndForm}
                type="button"
                onClick={handleSubmit(handleFormSubmit(DIREKTE_BTN_ID))}
              >
                Fortsett uten å dele utkastet
              </Button>
              <div className="ml-4">
                <HelpText>
                  Utkastet deles ikke til brukeren. Brukeren skal allerede vite hvilke opplysninger
                  som blir delt med tiltaksarrangør.
                </HelpText>
              </div>
            </div>
          </VStack>
        </FormProvider>
      </form>
    </VStack>
  )
}
