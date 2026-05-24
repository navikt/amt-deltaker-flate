import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { lagMockDeltaker } from '../mocks/mockData'
import {
  ScopedSortState,
  SortKey,
  useDeltakerSortering
} from './useDeltakerSortering'

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

  it('toggler fra descending til ascending på første klikk på aktiv kolonne', () => {
    const { result } = renderHook(() =>
      useDeltakerSortering(deltakere, undefined)
    )

    act(() => {
      result.current.handleSort(SortKey.SOKT_INN_DATO)
    })

    expect(result.current.sort).toEqual({
      orderBy: SortKey.SOKT_INN_DATO,
      direction: 'ascending'
    })
  })

  it('toggler tilbake til descending på andre klikk', () => {
    const { result } = renderHook(() =>
      useDeltakerSortering(deltakere, undefined)
    )

    act(() => {
      result.current.handleSort(SortKey.SOKT_INN_DATO)
    })
    act(() => {
      result.current.handleSort(SortKey.SOKT_INN_DATO)
    })

    expect(result.current.sort).toEqual({
      orderBy: SortKey.SOKT_INN_DATO,
      direction: 'descending'
    })
  })

  it('bytter kolonne og setter descending som default retning', () => {
    const { result } = renderHook(() =>
      useDeltakerSortering(deltakere, undefined)
    )

    act(() => {
      result.current.handleSort(SortKey.NAVN)
    })

    expect(result.current.sort).toEqual({
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
