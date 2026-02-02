import { BodyLong, Heading } from '@navikt/ds-react'
import {
  importertDeltakerFraArena,
  Tiltakskode,
  Vedtaksinformasjon,
  DeltakerStatusType,
  Oppstartstype
} from '../model/deltaker'
import { formatDate } from '../utils/utils'

interface Props {
  statusType: DeltakerStatusType
  statusDato: Date
  oppstartstype: Oppstartstype | null
  tiltakskode: Tiltakskode
  vedtaksinformasjon: Vedtaksinformasjon | null
  importertFraArena: importertDeltakerFraArena | null
  className: string
}

export const VedtakInfo = ({
  statusType,
  statusDato,
  oppstartstype,
  tiltakskode,
  vedtaksinformasjon,
  importertFraArena,
  className
}: Props) => {
  // TODO bruke pameldingstype?
  const vedtaksDato =
    oppstartstype === Oppstartstype.FELLES &&
    statusType === DeltakerStatusType.IKKE_AKTUELL &&
    vedtaksinformasjon?.fattet === null
      ? statusDato
      : vedtaksinformasjon?.fattet

  const vedtakTekst = vedtaksinformasjon
    ? ` Vedtak fattet: ${formatDate(vedtaksDato)}. Meldt på av ${vedtakEndretAv(vedtaksinformasjon)}.`
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
				arbeidsmarkedstiltak kapittel ${forskriftskapitler[tiltakskode]}.`}
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

const forskriftskapitler: { [Key in Tiltakskode]: string } = {
  [Tiltakskode.ARBEIDSFORBEREDENDE_TRENING]: '13',
  [Tiltakskode.ARBEIDSRETTET_REHABILITERING]: '12',
  [Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET]: '14',
  [Tiltakskode.AVKLARING]: '2',
  [Tiltakskode.OPPFOLGING]: '4',
  [Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK]: '4',
  [Tiltakskode.JOBBKLUBB]: '4',
  [Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING]: '7',
  [Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING]: '7',
  [Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING]: '7',
  [Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING]: '7',
  [Tiltakskode.HOYERE_UTDANNING]: '7',
  [Tiltakskode.ARBEIDSMARKEDSOPPLAERING]: '7',
  [Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV]: '7',
  [Tiltakskode.STUDIESPESIALISERING]: '7',
  [Tiltakskode.FAG_OG_YRKESOPPLAERING]: '7',
  [Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING]: '7'
}
