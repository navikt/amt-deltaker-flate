import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useInvaliderDeltakere } from './useInvaliderDeltakere'
import {
  DELTAKERE_QUERY_KEY,
  FILTER_COUNTS_QUERY_KEY
} from '../api/tanstack-query-keys'

vi.mock('../context-providers/DeltakerlisteContext', () => ({
  useDeltakerlisteContext: () => ({
    deltakerlisteDetaljer: { id: 'liste-id' }
  })
}))

const renderWithClient = (client: QueryClient) =>
  renderHook(() => useInvaliderDeltakere(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
  })

describe('useInvaliderDeltakere', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('invaliderer deltakere-queries umiddelbart', async () => {
    const client = new QueryClient()
    const deltakereKey = [DELTAKERE_QUERY_KEY, 'liste-id', undefined, []]
    client.setQueryData(deltakereKey, [{ id: '1' }])

    const { result } = renderWithClient(client)

    await act(async () => {
      result.current()
    })

    expect(client.getQueryState(deltakereKey)?.isInvalidated).toBe(true)
  })

  it('invaliderer filterCounts-query etter 1 sekund', async () => {
    const client = new QueryClient()
    const filterCountsKey = [FILTER_COUNTS_QUERY_KEY, 'liste-id']
    client.setQueryData(filterCountsKey, { SOKT_INN: 5 })

    const { result } = renderWithClient(client)

    await act(async () => {
      result.current()
    })

    expect(client.getQueryState(filterCountsKey)?.isInvalidated).toBe(false)

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(client.getQueryState(filterCountsKey)?.isInvalidated).toBe(true)
  })

  it('invaliderer ikke queries for andre deltakerlister', async () => {
    const client = new QueryClient()
    const annenDeltakereKey = [DELTAKERE_QUERY_KEY, 'annen-id', undefined, []]
    const annenFilterKey = [FILTER_COUNTS_QUERY_KEY, 'annen-id']
    client.setQueryData(annenDeltakereKey, [{ id: '99' }])
    client.setQueryData(annenFilterKey, { SOKT_INN: 3 })

    const { result } = renderWithClient(client)

    await act(async () => {
      result.current()
    })

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(client.getQueryState(annenDeltakereKey)?.isInvalidated).toBe(false)
    expect(client.getQueryState(annenFilterKey)?.isInvalidated).toBe(false)
  })

  it('debouncer filterCounts – kun siste kall trigger invalidering', async () => {
    const client = new QueryClient()
    const filterCountsKey = [FILTER_COUNTS_QUERY_KEY, 'liste-id']
    client.setQueryData(filterCountsKey, { SOKT_INN: 5 })

    const { result } = renderWithClient(client)

    // Kall invalidering tre ganger raskt etter hverandre
    await act(async () => {
      result.current()
    })
    await act(async () => {
      vi.advanceTimersByTime(500)
      result.current()
    })
    await act(async () => {
      vi.advanceTimersByTime(500)
      result.current()
    })

    // Etter 999ms fra siste kall – ikke invalidert ennå
    await act(async () => {
      vi.advanceTimersByTime(999)
    })
    expect(client.getQueryState(filterCountsKey)?.isInvalidated).toBe(false)

    // Etter 1000ms fra siste kall – nå invalidert
    await act(async () => {
      vi.advanceTimersByTime(1)
    })
    expect(client.getQueryState(filterCountsKey)?.isInvalidated).toBe(true)
  })
})
