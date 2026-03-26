import { InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyShort, InfoCard, Link, ReadMore, Textarea } from '@navikt/ds-react'
import { List } from '@navikt/ds-react/List'
import { fjernUgyldigeTegn } from 'deltaker-flate-common'
import { useFormContext } from 'react-hook-form'
import {
  PameldingEnkeltplassFormValues,
  PRISINFO_MAX_TEGN
} from '../../../model/PameldingEnkeltplassFormValues'
import { usePameldingFormContext } from '../PameldingFormContext'
import { NAVET_OPPLAERINGSTILTAK_URL } from '../../../constants'

interface Props {
  className?: string
}

export const PrisOgBetaling = ({ className }: Props) => {
  const { disabled } = usePameldingFormContext()
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <div className={className}>
      <Textarea
        label="Pris og betalingsbetingelser"
        {...register('prisinformasjon')}
        value={watch('prisinformasjon')}
        onChange={(e) => {
          setValue('prisinformasjon', fjernUgyldigeTegn(e.target.value), {
            shouldValidate: true
          })
        }}
        error={errors.prisinformasjon?.message}
        disabled={disabled}
        maxLength={PRISINFO_MAX_TEGN}
        id="prisinformasjon"
        size="small"
      />

      <ReadMore
        header="Dette kan du inkludere i pris og betalingsbetingelser"
        size="small"
        className="mt-4"
      >
        <List as="ul" size="small">
          <List.Item>
            Om opplæringen er anskaffet eller om Nav skal gi tilskudd (ved
            tilgjengelig skoleplass)
          </List.Item>
          <List.Item>Hva kostnadene består av og totalbeløp for Nav</List.Item>
          <List.Item>Om brukeren skal dekke deler av kostnadene selv</List.Item>
        </List>

        <BodyShort size="small" className="mt-4">
          Les mer på navet:{' '}
          <Link href={NAVET_OPPLAERINGSTILTAK_URL}>
            Opplæringstiltak - anskaffelse eller tilskudd?
          </Link>
        </BodyShort>
      </ReadMore>

      <InfoCard className="mt-8" size="small">
        <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
          <InfoCard.Title>
            Prisinformasjonen sendes til godkjenning. Hvis tiltaksøkonomien
            godkjennes så fattes vedtaket, og brukeren blir varslet.
          </InfoCard.Title>
        </InfoCard.Header>
      </InfoCard>
    </div>
  )
}
