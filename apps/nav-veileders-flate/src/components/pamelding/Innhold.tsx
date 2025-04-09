import {
  BodyLong,
  Checkbox,
  CheckboxGroup,
  Heading,
  Textarea
} from '@navikt/ds-react'
import {
  ArenaTiltakskode,
  fjernUgyldigeTegn,
  INNHOLD_TYPE_ANNET
} from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import {
  BESKRIVELSE_ANNET_MAX_TEGN,
  erInnholdPakrevd,
  generateFormDefaultValues,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'

interface Props {
  pamelding: PameldingResponse
  isDisabled?: boolean
}

export const Innhold = ({ pamelding, isDisabled }: Props) => {
  const innhold = pamelding.deltakerliste.tilgjengeligInnhold
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const skalViseInnholdSjekkbokser =
    erInnholdPakrevd(tiltakstype) && innhold.innhold.length > 0

  const defaultValues = generateFormDefaultValues(pamelding)

  const {
    watch,
    setValue,
    register,
    clearErrors,
    formState: { errors }
  } = useFormContext<PameldingFormValues>()

  const valgteInnhold = watch('valgteInnhold')

  useEffect(() => {
    if (!valgteInnhold.find((i) => i === INNHOLD_TYPE_ANNET)) {
      clearErrors('innholdAnnetBeskrivelse')
    }
  }, [valgteInnhold])

  const skalViseInnhold =
    pamelding.deltakelsesinnhold?.ledetekst ||
    skalViseInnholdSjekkbokser ||
    tiltakstype === ArenaTiltakskode.VASV

  if (!pamelding.deltakelsesinnhold || !skalViseInnhold) {
    return null
  }

  return (
    <div>
      <section>
        <Heading size="medium" level="3">
          Dette er innholdet
        </Heading>
        {pamelding.deltakelsesinnhold.ledetekst && (
          <BodyLong size="small">
            {pamelding.deltakelsesinnhold.ledetekst}
          </BodyLong>
        )}
      </section>

      {tiltakstype === ArenaTiltakskode.VASV && (
        <section className="mt-4">
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

      {skalViseInnholdSjekkbokser && (
        <section className="mt-4">
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
    </div>
  )
}
