import { Alert, Textarea } from '@navikt/ds-react'
import { erOpplaringstiltak, fjernUgyldigeTegn } from 'deltaker-flate-common'
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

  if (!erOpplaringstiltak(tiltakskode)) {
    return null
  }

  return (
    <div>
      <Textarea
        label="Dette er innholdet (valgfritt)"
        description="Hvis arrangøren har ulike tilbud skal du skrive hva personen trenger opplæring i. Ta bare med bakgrunnsinfo som er nødvendig."
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

      <Alert variant="info" size="small" inline className="mt-4">
        Opplysningene blir synlig for deltakeren, tiltakskoordinator i Nav og
        tiltaksarrangøren.
      </Alert>
    </div>
  )
}
