import { BodyLong, Heading } from '@navikt/ds-react'
import {
  importertDeltakerFraArena,
  ArenaTiltakskode,
  Vedtaksinformasjon
} from '../model/deltaker'
import { formatDate, formatDateStrWithMonthName } from '../utils/utils'

interface Props {
  tiltakstype: ArenaTiltakskode
  vedtaksinformasjon: Vedtaksinformasjon | null
  importertFraArena: importertDeltakerFraArena | null
  className: string
}

export const VedtakInfo = ({
  tiltakstype,
  vedtaksinformasjon,
  importertFraArena,
  className
}: Props) => {
  const vedtakTekst = vedtaksinformasjon
    ? ` Vedtak fattet: ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)}. Meldt på av ${vedtakEndretAv(vedtaksinformasjon)}.`
    : null
  const importertTekst =
    !vedtakTekst && importertFraArena
      ? ` Søkt inn: ${formatDate(importertFraArena.innsoktDato)}.`
      : null

  return (
    <div className={className}>
      <Heading level="2" size="medium">
        Dette er et vedtak
      </Heading>
      <BodyLong size="small" className="mt-2">
        {`Dette er et vedtak etter arbeidsmarkedsloven § 12 og forskrift om
				arbeidsmarkedstiltak kapittel ${forskriftskapitler[tiltakstype]}.`}
        {vedtakTekst || importertTekst || ''}
      </BodyLong>
    </div>
  )
}

const vedtakEndretAv = (vedtaksinformasjon: Vedtaksinformasjon): string => {
  if (vedtaksinformasjon.sistEndretAvEnhet === null)
    return vedtaksinformasjon.sistEndretAv
  return `${vedtaksinformasjon.sistEndretAv}, ${vedtaksinformasjon.sistEndretAvEnhet}`
}

const forskriftskapitler: { [Key in ArenaTiltakskode]: string } = {
  [ArenaTiltakskode.ARBFORB]: '13',
  [ArenaTiltakskode.ARBRRHDAG]: '12',
  [ArenaTiltakskode.AVKLARAG]: '2',
  [ArenaTiltakskode.INDOPPFAG]: '4',
  [ArenaTiltakskode.DIGIOPPARB]: '4',
  [ArenaTiltakskode.GRUFAGYRKE]: '7',
  [ArenaTiltakskode.GRUPPEAMO]: '7',
  [ArenaTiltakskode.JOBBK]: '4',
  [ArenaTiltakskode.VASV]: '14'
}
