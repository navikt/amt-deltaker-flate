import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { lagMockDeltaker } from '../mocks/mockData'
import {
  ScopedSortState,
  SortKey,
  sorterDeltakere,
  useDeltakerSortering
} from './useDeltakerSortering'
import { lagTestDeltaker } from '../test-utils/lagTestDeltaker'

const DEFAULT_SORT: ScopedSortState = {
  orderBy: SortKey.SOKT_INN_DATO,
  direction: 'descending'
}

const NAVN_ASC: ScopedSortState = {
  orderBy: SortKey.NAVN,
  direction: 'ascending'
}

describe('useDeltakerSortering', () => {
  const deltakere = [lagMockDeltaker(), lagMockDeltaker(), lagMockDeltaker()]

  it('starter med default synkende sortering på Søkt inn', () => {
    const { result } = renderHook(() =>
      useDeltakerSortering(deltakere, undefined)
    )

    expect(result.current.sort).toEqual(DEFAULT_SORT)
  })

  it('handleSort kaller onSortChanged med ascending når aktiv kolonne klikkes', () => {
    const onSortChanged = vi.fn()

    const { result } = renderHook(() =>
      useDeltakerSortering(deltakere, DEFAULT_SORT)
    )

    act(() => {
      result.current.handleSort(SortKey.SOKT_INN_DATO, onSortChanged)
    })

    expect(onSortChanged).toHaveBeenCalledWith({
      orderBy: SortKey.SOKT_INN_DATO,
      direction: 'ascending'
    })
  })

  it('handleSort kaller onSortChanged med descending når ascending er aktiv', () => {
    const onSortChanged = vi.fn()
    const ascSort: ScopedSortState = {
      orderBy: SortKey.SOKT_INN_DATO,
      direction: 'ascending'
    }

    const { result } = renderHook(() =>
      useDeltakerSortering(deltakere, ascSort)
    )

    act(() => {
      result.current.handleSort(SortKey.SOKT_INN_DATO, onSortChanged)
    })

    expect(onSortChanged).toHaveBeenCalledWith({
      orderBy: SortKey.SOKT_INN_DATO,
      direction: 'descending'
    })
  })

  describe('sorterDeltakere', () => {
    it('sorterer etternavn uavhengig av store og små bokstaver', () => {
      const deltakere = [
        lagTestDeltaker({ id: '1', etternavn: 'Zebra' }),
        lagTestDeltaker({ id: '2', etternavn: 'apple' })
      ]

      const sorterteDeltakere = sorterDeltakere(deltakere, NAVN_ASC)

      expect(sorterteDeltakere.map(({ etternavn }) => etternavn)).toEqual([
        'apple',
        'Zebra'
      ])

      expect(
        sorterDeltakere(deltakere, {
          ...NAVN_ASC,
          direction: 'descending'
        }).map(({ etternavn }) => etternavn)
      ).toEqual(['Zebra', 'apple'])
    })
  })

  it('handleSort kaller onSortChanged med descending når ny kolonne velges', () => {
    const onSortChanged = vi.fn()

    const { result } = renderHook(() =>
      useDeltakerSortering(deltakere, DEFAULT_SORT)
    )

    act(() => {
      result.current.handleSort(SortKey.NAVN, onSortChanged)
    })

    expect(onSortChanged).toHaveBeenCalledWith({
      orderBy: SortKey.NAVN,
      direction: 'descending'
    })
  })

  it('resetter til default sort når sorteringsValg endres til undefined', () => {
    let sorteringsValg: ScopedSortState | undefined = NAVN_ASC

    const { result, rerender } = renderHook(() =>
      useDeltakerSortering(deltakere, sorteringsValg)
    )

    expect(result.current.sort).toEqual(NAVN_ASC)

    sorteringsValg = undefined
    rerender()

    expect(result.current.sort).toEqual(DEFAULT_SORT)
  })

  it('tar i bruk nytt sorteringsValg når prop endres', () => {
    let sorteringsValg: ScopedSortState | undefined = undefined

    const { result, rerender } = renderHook(() =>
      useDeltakerSortering(deltakere, sorteringsValg)
    )

    expect(result.current.sort).toEqual(DEFAULT_SORT)

    sorteringsValg = NAVN_ASC
    rerender()

    expect(result.current.sort).toEqual(NAVN_ASC)
  })
})
