import { Deltakere } from '../api/data/deltakerliste'

export enum FilterValg {
  AktiveForslag = 'AktiveForslag'
}

export const getFilterTypeNavn = (filterValg: FilterValg): string => {
  switch (filterValg) {
    case FilterValg.AktiveForslag:
      return 'Forslag fra arrangør'
    default:
      return 'Ukjent filter'
  }
}

export type FilterValgDeltakere = {
  filtervalg: FilterValg
  valgt: boolean
  navn: string
  filtrerteDeltakere: Deltakere
}

export const getFilterMedDeltakere = (
  deltakere: Deltakere,
  valgteFilter: FilterValg[]
): FilterValgDeltakere[] => {
  return Object.values(FilterValg).map((filterValg) => {
    const erValgt = valgteFilter.includes(filterValg)
    return {
      filtervalg: filterValg,
      navn: getFilterTypeNavn(filterValg),
      valgt: erValgt,
      filtrerteDeltakere: deltakere.filter((deltaker) => {
        switch (filterValg) {
          case FilterValg.AktiveForslag:
            return deltaker.harAktiveForslag
          default: // Ingen filter
            return false
        }
      })
    }
  })
}

export const getFiltrerteDeltakere = (
  filterMedDeltagere: FilterValgDeltakere[]
): Deltakere => {
  return filterMedDeltagere.reduce<Deltakere>((acc, filter) => {
    if (filter.valgt) {
      return [...acc, ...filter.filtrerteDeltakere]
    }
    return acc
  }, [])
}
