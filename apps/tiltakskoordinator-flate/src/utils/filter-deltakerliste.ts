import { Deltakere } from '../api/data/deltakerliste'

export enum FilterValg {
  AktiveForslag = 'AktiveForslag'
}

const getFilterTypeNavn = (filterValg: FilterValg): string => {
  switch (filterValg) {
    case FilterValg.AktiveForslag:
      return 'Forslag fra arrangør'
    default:
      return 'Ukjent filter'
  }
}

export const getFiltrerteDeltakere = (
  delttakere: Deltakere,
  filterValg: FilterValg[]
): Deltakere => {
  const valgteFilter = new Set(filterValg)
  return delttakere.filter((deltaker) => {
    let filterOk = true

    valgteFilter.forEach((filterValg) => {
      if (filterOk) {
        switch (filterValg) {
          case FilterValg.AktiveForslag:
            filterOk = deltaker.harAktiveForslag
            break
        }
      }
    })

    return filterOk
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
      antall: getFiltrerteDeltakere(deltakere, valgteFilter.concat(filterValg))
        .length
    }
  })
}
