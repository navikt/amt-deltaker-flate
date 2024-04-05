import { BodyLong, Detail, Heading } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from '../../utils/utils.ts'
import { Vedtaksinformasjon } from '../../api/data/pamelding.ts'

interface Props {
  vedtaksinformasjon: Vedtaksinformasjon | null
  className: string
}

export const HvaErDette = ({ vedtaksinformasjon, className }: Props) => {
  const harNavMeldtPaDirekte = vedtaksinformasjon?.fattetAvNav

  return (
    <div className={className}>
      <Heading level="2" size="medium">
        Hva er dette?
      </Heading>
      <BodyLong size="small">
        Dette er et vedtak etter arbeidsmarkedsloven § 12 og forskrift om
        arbeidsmarkedstiltak kapittel 4.
      </BodyLong>
      {vedtaksinformasjon && (
        <Detail className="mt-2">
          {harNavMeldtPaDirekte
            ? `Meldt på: ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)} av ${vedtakEndretAv(vedtaksinformasjon)}.`
            : `Utkast delt av: ${vedtakEndretAv(vedtaksinformasjon)}. Du godkjente ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)}.`}
        </Detail>
      )}
    </div>
  )
}

const vedtakEndretAv = (vedtaksinformasjon: Vedtaksinformasjon): string => {
  if (vedtaksinformasjon.sistEndretAvEnhet === null)
    return vedtaksinformasjon.sistEndretAv
  return `${vedtaksinformasjon.sistEndretAv} ${vedtaksinformasjon.sistEndretAvEnhet}`
}
