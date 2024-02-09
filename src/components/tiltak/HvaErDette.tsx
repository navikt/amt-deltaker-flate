import { BodyLong, Detail, Heading } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from '../../utils/utils.ts'
import { Vedtaksinformasjon } from '../../api/data/pamelding.ts'

interface Props {
  vedtaksinformasjon: Vedtaksinformasjon | null
}

export const HvaErDette = ({ vedtaksinformasjon }: Props) => {
  const harNavMeldtPaDirekte = vedtaksinformasjon?.fattetAvNavVeileder

  return (
    <div>
      <Heading level="2" size="medium">
        Hva er dette?
      </Heading>
      <BodyLong size="small">
        Dette er et vedtak etter arbeidsmarkedsloven § 12 og forskrift om arbeidsmarkedstiltak
        kapittel 4.
      </BodyLong>
      {vedtaksinformasjon && (
        <Detail className="mt-2">
          {harNavMeldtPaDirekte
            ? `Meldt på: ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)} av ${vedtaksinformasjon.fattetAvNavVeileder}.`
            : `Utkast delt av: ${vedtaksinformasjon.sistEndretAv}. Du godkjente ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)}.`}
        </Detail>
      )}
    </div>
  )
}
