import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDeferredFetch, DeferredFetchState } from 'deltaker-flate-common'

describe('useDeferredFetch', () => {
  it('starter i NOT_STARTED-tilstand', () => {
    const apiFunction = vi.fn()
    const { result } = renderHook(() => useDeferredFetch(apiFunction))
    expect(result.current.state).toBe(DeferredFetchState.NOT_STARTED)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('setter LOADING mens kall pågår', async () => {
    let resolvePromise!: (v: string) => void
    const apiFunction = vi.fn(
      () => new Promise<string>((r) => (resolvePromise = r))
    )
    const { result } = renderHook(() => useDeferredFetch(apiFunction))

    act(() => {
      result.current.doFetch()
    })

    expect(result.current.state).toBe(DeferredFetchState.LOADING)

    await act(async () => {
      resolvePromise('data')
    })
    expect(result.current.state).toBe(DeferredFetchState.RESOLVED)
  })

  it('setter data og RESOLVED etter vellykket kall', async () => {
    const apiFunction = vi.fn().mockResolvedValue({ id: 42 })
    const { result } = renderHook(() => useDeferredFetch(apiFunction))

    await act(async () => {
      await result.current.doFetch()
    })

    expect(result.current.state).toBe(DeferredFetchState.RESOLVED)
    expect(result.current.data).toEqual({ id: 42 })
    expect(result.current.error).toBeNull()
  })

  it('kaller onResolved-callback etter vellykket kall', async () => {
    const apiFunction = vi.fn().mockResolvedValue('ok')
    const onResolved = vi.fn()
    const { result } = renderHook(() =>
      useDeferredFetch(apiFunction, onResolved)
    )

    await act(async () => {
      await result.current.doFetch()
    })

    expect(onResolved).toHaveBeenCalledOnce()
  })

  it('setter error.message fra Error-objekt og ERROR-tilstand ved feil', async () => {
    const apiFunction = vi
      .fn()
      .mockRejectedValue(new Error('API-feil'))

    const { result } = renderHook(() => useDeferredFetch(apiFunction))

    await act(async () => {
      await result.current.doFetch().catch(() => {})
    })

    expect(result.current.state).toBe(DeferredFetchState.ERROR)
    expect(result.current.error).toBe('API-feil')
  })

  it('setter generell feilmelding og ERROR-tilstand når kastet verdi ikke er et Error-objekt', async () => {
    const apiFunction = vi.fn().mockRejectedValue('en streng feil')

    const { result } = renderHook(() => useDeferredFetch(apiFunction))

    await act(async () => {
      await result.current.doFetch().catch(() => {})
    })

    expect(result.current.state).toBe(DeferredFetchState.ERROR)
    expect(result.current.error).toBe(
      'Det skjedde en feil ved henting av data.'
    )
  })

  it('setter generell feilmelding når kastet verdi er et tall', async () => {
    const apiFunction = vi.fn().mockRejectedValue(500)

    const { result } = renderHook(() => useDeferredFetch(apiFunction))

    await act(async () => {
      await result.current.doFetch().catch(() => {})
    })

    expect(result.current.state).toBe(DeferredFetchState.ERROR)
    expect(result.current.error).toBe(
      'Det skjedde en feil ved henting av data.'
    )
  })

  it('re-kaster feilen slik at kaller kan håndtere den', async () => {
    const apiFunction = vi
      .fn()
      .mockRejectedValue(new Error('re-kastet'))
    const { result } = renderHook(() => useDeferredFetch(apiFunction))

    await expect(
      act(async () => {
        await result.current.doFetch()
      })
    ).rejects.toThrow('re-kastet')
  })
})
