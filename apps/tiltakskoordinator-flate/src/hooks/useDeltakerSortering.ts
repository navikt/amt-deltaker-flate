import { SortState } from '@navikt/ds-react'
import { useMemo } from 'react'
import { Deltaker } from '../api/data/deltakerliste'

export interface ScopedSortState extends SortState {
  orderBy: keyof Deltaker
}

export enum SortKey {
  NAVN = 'etternavn',
  NAV_ENHET = 'navEnhet',
  STATUS = 'status',
  VURDERING = 'vurdering',
  SOKT_INN_DATO = 'soktInnDato',
  START_DATO = 'startdato',
  SLUTT_DATO = 'sluttdato'
}

const DEFAULT_SORT: ScopedSortState = {
  orderBy: SortKey.SOKT_INN_DATO,
  direction: 'descending'
}

/**
 * Sorterer deltakere basert på brukerens valg.
 * Sorterings-staten eies av SorteringContext – denne hooken er ren (ingen intern state).
 * handleSort beregner ny sortering og melder tilbake via callback.
 */
export const useDeltakerSortering = (
  deltakere: Deltaker[],
  sorteringsValg?: ScopedSortState
) => {
  const sort = sorteringsValg ?? DEFAULT_SORT

  const sorterteDeltagere = useMemo(
    () => sorterDeltakere(deltakere, sort),
    [deltakere, sort.orderBy, sort.direction]
  )

  const handleSort = (
    sortKey: ScopedSortState['orderBy'],
    onSortChanged: (newSort: ScopedSortState) => void
  ) => {
    onSortChanged({
      orderBy: sortKey,
      direction:
        sortKey === sort.orderBy && sort.direction === 'descending'
          ? 'ascending'
          : 'descending'
    })
  }

  return {
    sort,
    handleSort,
    sorterteDeltagere
  }
}

function comparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export const sorterDeltakere = (
  deltakere: Deltaker[],
  sort?: ScopedSortState
) =>
  deltakere.slice().sort((a, b) => {
    if (sort?.orderBy === SortKey.STATUS) {
      return sort.direction === 'ascending'
        ? comparator(b.status, a.status, 'type')
        : comparator(a.status, b.status, 'type')
    }

    if (sort) {
      const aVal = a[sort.orderBy]
      const bVal = b[sort.orderBy]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
  })
