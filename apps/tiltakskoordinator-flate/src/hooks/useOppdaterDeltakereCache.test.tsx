import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TilgangsFeil } from '../api/api'
import { Deltaker } from '../api/data/deltakerliste'
import { useOppdaterDeltakereCache } from './useOppdaterDeltakereCache'

vi.mock('../context-providers/DeltakerlisteContext', () => ({
  useDeltakerlisteContext: () => ({
    deltakerlisteDetaljer: { id: 'liste-id' }
  })
}))

const lagDeltaker = (id: string, navn: string): Deltaker =>
  ({ id, fornavn: navn }) as unknown as Deltaker

const renderWithClient = (client: QueryClient) =>
  renderHook(() => useOppdaterDeltakereCache(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
  })

describe('useOppdaterDeltakereCache', () => {
  it('oppdaterer deltakere i cachen for gjeldende deltakerliste', () => {
    const client = new QueryClient()
    const queryKey = ['deltakere', 'liste-id', undefined, []]
    client.setQueryData(queryKey, [lagDeltaker('1', 'Ola')])

    const { result } = renderWithClient(client)

    act(() => {
      result.current((deltakere) => [...deltakere, lagDeltaker('2', 'Kari')])
    })

    expect(client.getQueryData(queryKey)).toEqual([
      lagDeltaker('1', 'Ola'),
      lagDeltaker('2', 'Kari')
    ])
  })

  it('treffer alle filter-varianter for samme deltakerliste', () => {
    const client = new QueryClient()
    const key1 = ['deltakere', 'liste-id', undefined, []]
    const key2 = ['deltakere', 'liste-id', ['AktiveForslag'], ['DELTAR']]
    client.setQueryData(key1, [lagDeltaker('1', 'Ola')])
    client.setQueryData(key2, [lagDeltaker('1', 'Ola')])

    const { result } = renderWithClient(client)

    act(() => {
      result.current((deltakere) =>
        deltakere.map((d) => ({ ...d, fornavn: 'Endret' }))
      )
    })

    expect(client.getQueryData<Deltaker[]>(key1)?.[0].fornavn).toBe('Endret')
    expect(client.getQueryData<Deltaker[]>(key2)?.[0].fornavn).toBe('Endret')
  })

  it('treffer ikke andre deltakerlister', () => {
    const client = new QueryClient()
    const minKey = ['deltakere', 'liste-id', undefined, []]
    const annenKey = ['deltakere', 'annen-liste-id', undefined, []]
    client.setQueryData(minKey, [lagDeltaker('1', 'Ola')])
    client.setQueryData(annenKey, [lagDeltaker('99', 'Skal ikke endres')])

    const { result } = renderWithClient(client)

    act(() => {
      result.current((deltakere) =>
        deltakere.map((d) => ({ ...d, fornavn: 'Endret' }))
      )
    })

    expect(client.getQueryData<Deltaker[]>(annenKey)?.[0].fornavn).toBe(
      'Skal ikke endres'
    )
  })

  it('hopper over tilgangsfeil-data uten å kalle oppdaterer', () => {
    const client = new QueryClient()
    const queryKey = ['deltakere', 'liste-id', undefined, []]
    client.setQueryData(queryKey, TilgangsFeil.IkkeTilgangTilDeltakerliste)

    const oppdaterer = vi.fn((deltakere: Deltaker[]) => deltakere)

    const { result } = renderWithClient(client)

    act(() => {
      result.current(oppdaterer)
    })

    expect(oppdaterer).not.toHaveBeenCalled()
    expect(client.getQueryData(queryKey)).toBe(
      TilgangsFeil.IkkeTilgangTilDeltakerliste
    )
  })

  it('hopper over undefined-data uten å kalle oppdaterer', () => {
    const client = new QueryClient()
    const oppdaterer = vi.fn((deltakere: Deltaker[]) => deltakere)

    const { result } = renderWithClient(client)

    act(() => {
      result.current(oppdaterer)
    })

    expect(oppdaterer).not.toHaveBeenCalled()
  })
})
