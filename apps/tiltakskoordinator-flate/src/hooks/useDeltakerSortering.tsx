import { SortState } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { Deltaker } from '../api/data/deltakerliste'

export interface ScopedSortState extends SortState {
  orderBy: keyof Deltaker
}

export enum SortKey {
  NAVN = 'fornavn',
  NAV_ENHET = 'navEnhet',
  STATUS = 'status',
  VURDERING = 'vurdering'
}

export const useDeltakerSortering = (
  deltakere: Deltaker[],
  sorteringsValg?: ScopedSortState
) => {
  const [sort, setSort] = useState<ScopedSortState | undefined>(sorteringsValg)
  const [sorterteDeltagere, setSorterteDeltagere] = useState<Deltaker[]>(
    sorterDeltakere(deltakere)
  )

  useEffect(() => {
    setSorterteDeltagere(sorterDeltakere(deltakere, sort))
  }, [deltakere, sort])

  const handleSort = (
    sortKey: ScopedSortState['orderBy'],
    onSortChanged?: (newSort: ScopedSortState) => void
  ) => {
    const newSort =
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction:
              sort && sortKey === sort.orderBy && sort.direction === 'ascending'
                ? 'descending'
                : 'ascending'
          }
    // @ts-expect-error newSort er riktig
    setSort(newSort)
    if (onSortChanged) {
      // @ts-expect-error newSort er riktig
      onSortChanged(newSort)
    }
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
      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
  })
