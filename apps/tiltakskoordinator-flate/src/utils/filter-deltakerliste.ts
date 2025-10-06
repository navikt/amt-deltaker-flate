import {
  DeltakerStatusType,
  getDeltakerStatusDisplayText,
  Oppstartstype
} from 'deltaker-flate-common'
import { Deltakere } from '../api/data/deltakerliste'

export enum HandlingFilterValg {
  AktiveForslag = 'AktiveForslag',
  OppdateringFraNav = 'OppdateringFraNav',
  NyeDeltakere = 'NyeDeltakere'
}

const statusFilterTyper = [
  DeltakerStatusType.SOKT_INN,
  DeltakerStatusType.VENTER_PA_OPPSTART,
  DeltakerStatusType.DELTAR,
  DeltakerStatusType.VENTELISTE,
  DeltakerStatusType.FULLFORT,
  DeltakerStatusType.AVBRUTT,
  DeltakerStatusType.IKKE_AKTUELL
] as const

export type StatusFilterValg = (typeof statusFilterTyper)[number]

const getHandlingFilterTypeNavn = (filterValg: HandlingFilterValg): string => {
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

export const getFiltrerteDeltakere = (
  deltakere: Deltakere,
  handlingFilterValg: HandlingFilterValg[],
  statusFilterValg: StatusFilterValg[]
): Deltakere => {
  let filtrerte = deltakere

  if (handlingFilterValg.length > 0) {
    filtrerte = getHendelseFiltrerteDeltakere(filtrerte, handlingFilterValg)
  }

  if (statusFilterValg.length > 0) {
    filtrerte = getStatusFiltrerteDeltakere(filtrerte, statusFilterValg)
  }

  return filtrerte
}

export const getHendelseFiltrerteDeltakere = (
  deltakere: Deltakere,
  filterValg: HandlingFilterValg[]
): Deltakere => {
  const valgteFilter = new Set(filterValg)
  if (valgteFilter.size === 0) return deltakere

  return deltakere.filter((deltaker) => {
    let match = false

    valgteFilter.forEach((filterValg) => {
      switch (filterValg) {
        case HandlingFilterValg.AktiveForslag:
          if (deltaker.harAktiveForslag) match = true
          break
        case HandlingFilterValg.OppdateringFraNav:
          if (deltaker.harOppdateringFraNav) match = true
          break
        case HandlingFilterValg.NyeDeltakere:
          if (deltaker.erNyDeltaker) match = true
          break
      }
    })
    return match
  })
}

export const getStatusFiltrerteDeltakere = (
  deltakere: Deltakere,
  filterValg: StatusFilterValg[]
): Deltakere => {
  const valgteFilter = new Set(filterValg)
  if (valgteFilter.size === 0) return deltakere

  return deltakere.filter((deltaker) => {
    let match = false

    valgteFilter.forEach((filterValg) => {
      const status = deltaker.status.type
      if (status === filterValg) {
        match = true
      }
    })

    return match
  })
}

export type HandlingFilterDetaljer = {
  filtervalg: HandlingFilterValg
  valgt: boolean
  navn: string
  antall: number
}

export const getHendelseFilterDetaljer = (
  deltakere: Deltakere,
  valgteFilter: HandlingFilterValg[],
  valgteStatusFilter: StatusFilterValg[],
  oppstartstype: Oppstartstype
): HandlingFilterDetaljer[] => {
  const deltakereFiltretPaaStatus = getStatusFiltrerteDeltakere(
    deltakere,
    valgteStatusFilter
  )

  return Object.values(HandlingFilterValg)
    .filter(
      (filterValg) =>
        oppstartstype === Oppstartstype.FELLES
          ? true
          : filterValg === HandlingFilterValg.AktiveForslag // Kun vise denne for Løpende oppstart
    )
    .map((filterValg) => {
      const erValgt = valgteFilter.includes(filterValg)

      return {
        filtervalg: filterValg,
        navn: getHandlingFilterTypeNavn(filterValg),
        valgt: erValgt,
        antall: getHendelseFiltrerteDeltakere(deltakereFiltretPaaStatus, [
          filterValg
        ]).length
      }
    })
}

export type StatusFilterDetaljer = {
  filtervalg: StatusFilterValg
  valgt: boolean
  navn: string
  antall: number
}

export const getStatusFilterDetaljer = (
  deltakere: Deltakere,
  valgteFilter: StatusFilterValg[],
  valgteHandlingerFilter: HandlingFilterValg[]
): StatusFilterDetaljer[] => {
  const deltakereFiltretPaaHandlinger = getHendelseFiltrerteDeltakere(
    deltakere,
    valgteHandlingerFilter
  )
  return statusFilterTyper.map((filterValg) => {
    const erValgt = valgteFilter.includes(filterValg)

    return {
      filtervalg: filterValg,
      navn: getDeltakerStatusDisplayText(filterValg),
      valgt: erValgt,
      antall: getStatusFiltrerteDeltakere(deltakereFiltretPaaHandlinger, [
        filterValg
      ]).length
    }
  })
}
