import { BodyLong, Checkbox, CheckboxGroup, Heading, Textarea, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PameldingResponse, Tiltakstype } from '../../api/data/pamelding.ts'
import {
  BAKGRUNNSINFORMASJON_MAKS_TEGN,
  BESKRIVELSE_ANNET_MAX_TEGN,
  generateFormDefaultValues,
  pameldingFormSchema,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'
import { Deltakelsesprosent } from './Deltakelsesprosent.tsx'
import { Todo } from '../Todo.tsx'
import { PameldingFormButtons } from './PameldingFormButtons.tsx'
import { useEffect, useRef, useState } from 'react'
import { MAL_TYPE_ANNET } from '../../utils/utils.ts'
import { MeldPaDirekteButton } from './MeldPaDirekteButton.tsx'
import { debounce } from '../../utils/debounce.ts'

interface Props {
  pamelding: PameldingResponse
  className?: string
  disabled?: boolean
  focusOnOpen?: boolean
  disableForm?: (disable: boolean) => void
  onFormChanged?: (values: PameldingFormValues) => void
  onCancelUtkast?: () => void
}

export const PameldingForm = ({
  pamelding,
  className,
  disabled,
  focusOnOpen,
  disableForm,
  onFormChanged,
  onCancelUtkast
}: Props) => {
  const mal = pamelding.mal
  const tiltakstype = pamelding.deltakerliste.tiltakstype
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
    formState: { errors },
    getValues
  } = methods

  const watchedFields = watch()
  const valgteMal = watch('valgteMal')

  const handleDiableForm = (disable: boolean) => {
    setIsDisabled(disable)
    disableForm && disableForm(disable)
  }

  useEffect(() => {
    if (focusOnOpen && formRef?.current) formRef.current.focus()
  }, [])

  useEffect(() => {
    debounce(() => {
      if(onFormChanged) {
        onFormChanged(getValues())
      }
    }, 2000)
  }, [watchedFields])

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
              (<Todo />: Her skal det vel være en tekst til veileder?)
              <br />
              Du får tett oppfølging og støtte av en veileder. Sammen Kartlegger dere hvordan din
              kompetanse , interesser og ferdigheter påvirker muligheten din til å jobbe.
            </BodyLong>
          </section>

          <section className="mb-8 mt-4">
            {mal.length > 0 && (
              <CheckboxGroup
                defaultValue={defaultValues.valgteMal}
                legend="Hva mer skal tiltaket inneholde?"
                error={errors.valgteMal?.message}
                size="small"
                disabled={isDisabled}
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
                    disabled={isDisabled}
                    aria-label={'Beskrivelse av mål "Annet"'}
                    aria-required
                    maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
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
              disabled={isDisabled}
              maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
              id="bakgrunnsinformasjon"
              size="small"
            />
          </section>

          {(tiltakstype === Tiltakstype.VASV || tiltakstype === Tiltakstype.ARBFORB) && (
            <Deltakelsesprosent
              disabled={isDisabled}
              deltakelsesprosentValg={defaultValues.deltakelsesprosentValg}
              deltakelsesprosent={defaultValues.deltakelsesprosent}
              dagerPerUke={defaultValues.dagerPerUke}
            />
          )}

          <PameldingFormButtons
            pamelding={pamelding}
            disabled={isDisabled}
            disableForm={handleDiableForm}
            onCancelUtkast={onCancelUtkast}
          />
        </VStack>

        <MeldPaDirekteButton
          pamelding={pamelding}
          disabled={isDisabled}
          disableForm={handleDiableForm}
        />
      </FormProvider>
    </form>
  )
}
