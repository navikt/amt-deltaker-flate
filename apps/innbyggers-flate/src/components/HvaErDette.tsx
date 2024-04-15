import { BodyLong, Detail, Heading } from '@navikt/ds-react'
import { formatDateStrWithMonthName } from '../utils/utils.ts'
import { Tiltakstype, Vedtaksinformasjon } from '../api/data/deltaker.ts'

interface Props {
  tiltakstype: Tiltakstype
  vedtaksinformasjon: Vedtaksinformasjon | null
  className: string
}

export const HvaErDette = ({
  tiltakstype,
  vedtaksinformasjon,
  className
}: Props) => {
  const harNavMeldtPaDirekte = vedtaksinformasjon?.fattetAvNav

  return (
    <div className={className}>
      <Heading level="2" size="medium">
        Hva er dette?
      </Heading>
      <BodyLong size="small">
        {`Dette er et vedtak etter arbeidsmarkedsloven § 12 og forskrift om
				arbeidsmarkedstiltak kapittel ${forskriftskapitler[tiltakstype]}.`}
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

const forskriftskapitler: { [Key in Tiltakstype]: string } = {
  [Tiltakstype.ARBFORB]: '13',
  [Tiltakstype.ARBRRHDAG]: '12',
  [Tiltakstype.AVKLARAG]: '2',
  [Tiltakstype.INDOPPFAG]: '4',
  [Tiltakstype.DIGIOPPARB]: '4',
  [Tiltakstype.GRUFAGYRKE]: '7',
  [Tiltakstype.GRUPPEAMO]: '7',
  [Tiltakstype.JOBBK]: '4',
  [Tiltakstype.VASV]: '14'
}
