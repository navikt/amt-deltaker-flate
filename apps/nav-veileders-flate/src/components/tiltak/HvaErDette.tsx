import { BodyLong, Heading } from '@navikt/ds-react'
import { Tiltakstype, formatDateStrWithMonthName } from 'deltaker-flate-common'
import { Vedtaksinformasjon } from '../../api/data/pamelding.ts'

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
  return (
    <div className={className}>
      <Heading level="2" size="medium">
        Dette er et vedtak
      </Heading>
      <BodyLong size="small">
        {`Dette er et vedtak etter arbeidsmarkedsloven § 12 og forskrift om
				arbeidsmarkedstiltak kapittel ${forskriftskapitler[tiltakstype]}.`}
        {vedtaksinformasjon &&
          ` Vedtak fattet: ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)}. Meldt på av ${vedtakEndretAv(vedtaksinformasjon)}.`}
      </BodyLong>
    </div>
  )
}

const vedtakEndretAv = (vedtaksinformasjon: Vedtaksinformasjon): string => {
  if (vedtaksinformasjon.sistEndretAvEnhet === null)
    return vedtaksinformasjon.sistEndretAv
  return `${vedtaksinformasjon.sistEndretAv}, ${vedtaksinformasjon.sistEndretAvEnhet}`
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
