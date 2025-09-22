import {
  DeltakerStatusType,
  getDeltakerStatusDisplayText
} from 'deltaker-flate-common'
import { Deltakere } from '../api/data/deltakerliste'

export enum FilterValg {
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

const getFilterTypeNavn = (filterValg: FilterValg): string => {
  switch (filterValg) {
    case FilterValg.AktiveForslag:
      return 'Forslag fra arrangør'
    case FilterValg.OppdateringFraNav:
      return 'Oppdatering fra Nav'
    case FilterValg.NyeDeltakere:
      return 'Nye deltakere'
    default:
      return 'Ukjent filter'
  }
}

export const getFiltrerteDeltakere = (
  deltakere: Deltakere,
  filterValg: FilterValg[]
): Deltakere => {
  const valgteFilter = new Set(filterValg)
  if (valgteFilter.size === 0) return deltakere

  return deltakere.filter((deltaker) => {
    let match = false

    valgteFilter.forEach((filterValg) => {
      switch (filterValg) {
        case FilterValg.AktiveForslag:
          if (deltaker.harAktiveForslag) match = true
          break
        case FilterValg.OppdateringFraNav:
          if (deltaker.harOppdateringFraNav) match = true
          break
        case FilterValg.NyeDeltakere:
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

export type FilterDetaljer = {
  filtervalg: FilterValg | StatusFilterValg
  valgt: boolean
  navn: string
  antall: number
}

export const getFilterDetaljer = (
  deltakere: Deltakere,
  valgteFilter: FilterValg[]
): FilterDetaljer[] => {
  return Object.values(FilterValg).map((filterValg) => {
    const erValgt = valgteFilter.includes(filterValg)

    return {
      filtervalg: filterValg,
      navn: getFilterTypeNavn(filterValg),
      valgt: erValgt,
      antall: getFiltrerteDeltakere(deltakere, [filterValg]).length
    }
  })
}

export const getStatusFilterDetaljer = (
  deltakere: Deltakere,
  valgteFilter: StatusFilterValg[]
): FilterDetaljer[] => {
  return statusFilterTyper.map((filterValg) => {
    const erValgt = valgteFilter.includes(filterValg)

    return {
      filtervalg: filterValg,
      navn: getDeltakerStatusDisplayText(filterValg),
      valgt: erValgt,
      antall: getStatusFiltrerteDeltakere(deltakere, [filterValg]).length
    }
  })
}
