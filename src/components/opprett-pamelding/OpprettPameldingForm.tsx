import {Button, Checkbox, CheckboxGroup, HStack, Textarea} from '@navikt/ds-react'
import {FormProvider, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {type Mal, Tiltakstype} from '../../api/data/pamelding.ts'
import {DeltakelsesprosentValg, MAL_TYPE_ANNET} from '../../utils.ts'
import {Deltakelsesprosent} from '../../pages/pamelding/components/Deltakelsesprosent.tsx'
import {pameldingFormSchema, PameldingFormValues} from '../../model/PameldingFormValues.ts'

interface Props {
    disableSubmit: boolean
    onSendSomForslag: (data: PameldingFormValues) => void
    sendSomForslagLoading: boolean
    onSendDirekte: (data: PameldingFormValues) => void
    sendDirekteLoading: boolean
    tiltakstype: Tiltakstype
    mal: Array<Mal>
    bakgrunnsinformasjon?: string
    deltakelsesprosent?: number
    dagerPerUke?: number
}

export const OpprettPameldingForm = ({
  disableSubmit,
  onSendSomForslag,
  sendSomForslagLoading,
  onSendDirekte,
  sendDirekteLoading,
  tiltakstype,
  mal,
  bakgrunnsinformasjon,
  deltakelsesprosent,
  dagerPerUke
}: Props) => {

  const FORSLAG_BTN_ID = 'sendSomForslagBtn'
  const DIREKTE_BTN_ID = 'sendDirekteBtn'

  const defaultValues: PameldingFormValues = {
    valgteMal: mal.filter((e) => e.valgt).map((e) => e.type),
    malAnnetBeskrivelse: '',
    bakgrunnsinformasjon: bakgrunnsinformasjon ?? '',
    deltakelsesprosentValg: deltakelsesprosent ? DeltakelsesprosentValg.JA : undefined,
    deltakelsesprosent: deltakelsesprosent?.toString(),
    dagerPerUke: dagerPerUke?.toString()
  }

  const methods = useForm<PameldingFormValues>({
    defaultValues,
    resolver: zodResolver(pameldingFormSchema),
    shouldFocusError: false
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors}
  } = methods

  const handleFormSubmit = (submitType: 'sendSomForslagBtn' | 'sendDirekteBtn') => (data: PameldingFormValues) => {
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
    <form>
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
              {...register('malAnnetBeskrivelse')}
              defaultValue={defaultValues.malAnnetBeskrivelse}
              error={errors.malAnnetBeskrivelse?.message}
              aria-label={'Beskrivelse av mål "Annet"'}
              aria-required
              id="malAnnetBeskrivelse"
            />
          )}
        </CheckboxGroup>

        <Textarea
          label="Bakgrunnsinformasjon (valgfritt)"
          description="Hvis det er noe viktig med brukers livssituasjon som kommer til å påvirke deltakelsen på tiltaket kan du skrive dette her. Dette vises til bruker og tiltaksarrangør."
          {...register('bakgrunnsinformasjon')}
          defaultValue={defaultValues.bakgrunnsinformasjon}
          error={errors.bakgrunnsinformasjon?.message}
          size="small"
          id="bakgrunnsinformasjon"
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

        <HStack gap="4">
          <Button size="small"
            loading={sendSomForslagLoading}
            disabled={disableSubmit}
            type="button"
            onClick={handleSubmit(handleFormSubmit(FORSLAG_BTN_ID))}
          >
                        Send som forslag
          </Button>

          <Button size="small"
            variant="secondary"
            loading={sendDirekteLoading}
            disabled={disableSubmit}
            type="button"
            onClick={handleSubmit(handleFormSubmit(DIREKTE_BTN_ID))}
          >
                        Meld på uten å sende forslag
          </Button>

        </HStack>
      </FormProvider>
    </form>
  )
}
