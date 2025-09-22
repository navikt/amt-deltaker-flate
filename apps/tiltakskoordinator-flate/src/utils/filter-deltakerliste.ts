import { Deltakere } from '../api/data/deltakerliste'

export enum FilterValg {
  AktiveForslag = 'AktiveForslag',
  OppdateringFraNav = 'OppdateringFraNav',
  NyeDeltakere = 'NyeDeltakere'
}

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

  return deltakere.filter((deltaker) => {
    if (valgteFilter.size === 0) return true
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

export type FilterDetaljer = {
  filtervalg: FilterValg
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
