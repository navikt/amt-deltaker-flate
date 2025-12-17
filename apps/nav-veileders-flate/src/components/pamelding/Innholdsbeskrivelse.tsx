import { Textarea } from '@navikt/ds-react'
import { fjernUgyldigeTegn, Tiltakskode } from 'deltaker-flate-common'
import { useFormContext } from 'react-hook-form'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import {
  BAKGRUNNSINFORMASJON_MAKS_TEGN,
  PameldingFormValues
} from '../../model/PameldingFormValues.ts'

interface Props {
  pamelding: PameldingResponse
  isDisabled?: boolean
}

export const Innholdsbeskrivelse = ({ pamelding, isDisabled }: Props) => {
  const tiltakskode = pamelding.deltakerliste.tiltakskode

  const {
    watch,
    setValue,
    register,
    formState: { errors }
  } = useFormContext<PameldingFormValues>()

  const skalViseInnholdsbeskrivelse =
    tiltakskode === Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING ||
    tiltakskode === Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING

  if (!skalViseInnholdsbeskrivelse) {
    return null
  }

  return (
    <div>
      <Textarea
        label="Hva skal tiltaket inneholde? (valgfritt)"
        description="Hvis arrangør kan tilby ulikt innhold, så kan du skrive hva personen har behov for. Du kan også skrive relevante bakgrunnsinfo. Opplysningene blir synlig for deltakeren, tiltakskoordinator i Nav og tiltaksarrangør."
        {...register('bakgrunnsinformasjon')}
        value={watch('bakgrunnsinformasjon')}
        onChange={(e) => {
          setValue('bakgrunnsinformasjon', fjernUgyldigeTegn(e.target.value), {
            shouldValidate: true
          })
        }}
        error={errors.bakgrunnsinformasjon?.message}
        disabled={isDisabled}
        maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
        id="bakgrunnsinformasjon"
        size="small"
      />
    </div>
  )
}
