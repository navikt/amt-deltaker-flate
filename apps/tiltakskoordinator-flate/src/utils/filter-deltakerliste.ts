import {
  DeltakerStatusType,
  harKursAvslutning,
  kreverGodkjenningForPamelding,
  Oppstartstype,
  Pameldingstype,
  Tiltakskode
} from 'deltaker-flate-common'

export enum HandlingFilterValg {
  AktiveForslag = 'AktiveForslag',
  OppdateringFraNav = 'OppdateringFraNav',
  NyeDeltakere = 'NyeDeltakere'
}

export const getFilterStatuser = (
  oppstartstype: Oppstartstype | null,
  pameldingstype: Pameldingstype,
  tiltakskode: Tiltakskode
): StatusFilterValg[] => {
  const statuser: StatusFilterValg[] = []

  if (kreverGodkjenningForPamelding(pameldingstype)) {
    statuser.push(DeltakerStatusType.SOKT_INN, DeltakerStatusType.VENTELISTE)
  }

  statuser.push(
    DeltakerStatusType.VENTER_PA_OPPSTART,
    DeltakerStatusType.DELTAR
  )

  if (harKursAvslutning(oppstartstype, tiltakskode)) {
    statuser.push(DeltakerStatusType.FULLFORT, DeltakerStatusType.AVBRUTT)
  } else {
    statuser.push(DeltakerStatusType.HAR_SLUTTET)
  }

  // I en overgang vil gamle gruppetiltak med løpende oppstart ha avsluttende status HAR_SLUTTET
  if (
    oppstartstype === Oppstartstype.LOPENDE &&
    (tiltakskode === Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING ||
      tiltakskode === Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING)
  ) {
    statuser.push(DeltakerStatusType.HAR_SLUTTET)
  }

  statuser.push(DeltakerStatusType.IKKE_AKTUELL)
  return statuser
}

export const STATUS_FILTER_TYPER = [
  DeltakerStatusType.SOKT_INN,
  DeltakerStatusType.VENTELISTE,
  DeltakerStatusType.VENTER_PA_OPPSTART,
  DeltakerStatusType.DELTAR,
  DeltakerStatusType.FULLFORT,
  DeltakerStatusType.AVBRUTT,
  DeltakerStatusType.HAR_SLUTTET,
  DeltakerStatusType.IKKE_AKTUELL
] as const

export type StatusFilterValg = (typeof STATUS_FILTER_TYPER)[number]

export const getDefaultStatusFilter = (
  pameldingstype: Pameldingstype
): StatusFilterValg[] => {
  const defaultFilter: StatusFilterValg[] = [
    DeltakerStatusType.VENTER_PA_OPPSTART,
    DeltakerStatusType.DELTAR
  ]

  if (kreverGodkjenningForPamelding(pameldingstype)) {
    defaultFilter.unshift(
      DeltakerStatusType.SOKT_INN,
      DeltakerStatusType.VENTELISTE
    )
  }

  return defaultFilter
}

export const getHandlingFilterTypeNavn = (
  filterValg: HandlingFilterValg
): string => {
  switch (filterValg) {
    case HandlingFilterValg.AktiveForslag:
      return 'Forslag fra arrangør'
    case HandlingFilterValg.OppdateringFraNav:
      return 'Oppdatering fra Nav'
    case HandlingFilterValg.NyeDeltakere:
      return 'Nye deltakere'
    default:
      return 'Ukjent filter'
  }
}
