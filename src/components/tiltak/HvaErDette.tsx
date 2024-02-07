import { BodyLong, Detail, Heading } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from '../../utils/utils.ts'
import { Vedtaksinformasjon } from '../../api/data/pamelding.ts'

interface Props {
  vedtaksinformasjon: Vedtaksinformasjon
}

export const HvaErDette = ({ vedtaksinformasjon }: Props) => {
  const harDeltakerGodkjent = vedtaksinformasjon.fattet

  return (
    <div>
      <Heading level="2" size="medium">
        Hva er dette?
      </Heading>
      <BodyLong size="small">
        Dette er et vedtak etter arbeidsmarkedsloven § 12 og forskrift om arbeidsmarkedstiltak
        kapittel 4.
      </BodyLong>
      <Detail className="mt-2">
        {harDeltakerGodkjent
          ? `Utkast delt av: ${vedtaksinformasjon.sistEndretAv}. Du godkjente ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)}.`
          : `Meldt på: ${formatDateStrWithMonthName(vedtaksinformasjon.sistEndret)} av ${vedtaksinformasjon.sistEndretAv}.`}
      </Detail>
    </div>
  )
}
