import { BodyLong, Heading } from '@navikt/ds-react'
import {
  importertDeltakerFraArena,
  Tiltakstype,
  Vedtaksinformasjon
} from '../model/deltaker'
import { formatDate, formatDateStrWithMonthName } from '../utils/utils'

interface Props {
  tiltakstype: Tiltakstype
  vedtaksinformasjon: Vedtaksinformasjon | null
  importertFraArena: importertDeltakerFraArena | null
  className: string
}

export const HvaErDette = ({
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
