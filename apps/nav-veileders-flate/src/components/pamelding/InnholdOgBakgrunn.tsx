import { Alert, Textarea } from '@navikt/ds-react'
import {
  erEnkeltplassMedRammeavtale,
  fjernUgyldigeTegn,
  harFritekstSomDelesMedArrangor,
  Tiltakskode
} from 'deltaker-flate-common'
import { useFormContext } from 'react-hook-form'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import {
  BESKRIVELSE_ANNET_MAX_TEGN,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'

interface Props {
  pamelding: PameldingResponse
  isDisabled?: boolean
}

export const InnholdOgBakgrunn = ({ pamelding, isDisabled }: Props) => {
  const tiltakskode = pamelding.deltakerliste.tiltakskode

  const {
    watch,
    setValue,
    register,
    formState: { errors }
  } = useFormContext<PameldingFormValues>()

  const skalViseInnholdOgBakgrunn =
    [
      Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
      Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING
    ].includes(tiltakskode) ||
    erEnkeltplassMedRammeavtale(
      tiltakskode,
      pamelding.deltakerliste.pameldingstype
    )

  if (!skalViseInnholdOgBakgrunn) {
    return null
  }

  return (
    <div>
      <Textarea
        label="Dette er innholdet (valgfritt)"
        description="Du kan for eksempel skrive hva personen trenger opplæring i, eller bakgrunnsinfo som det er nødvendig at arrangøren får vite om"
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

      {harFritekstSomDelesMedArrangor(tiltakskode) && (
        <Alert variant="info" size="small" inline className="mt-4">
          Opplysningene blir synlig for deltakeren, tiltakskoordinator i Nav og
          tiltaksarrangør.
        </Alert>
      )}
    </div>
  )
}
