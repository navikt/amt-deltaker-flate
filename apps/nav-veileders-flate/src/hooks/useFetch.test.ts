import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useFetch } from 'deltaker-flate-common'

describe('useFetch', () => {
  it('returnerer loading=true initialt', () => {
    const apiFunction = vi.fn(() => new Promise(() => {}))
    const { result } = renderHook(() => useFetch(apiFunction))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('setter data og loading=false etter vellykket kall', async () => {
    const apiFunction = vi.fn().mockResolvedValue({ id: 1, navn: 'Test' })
    const { result } = renderHook(() => useFetch(apiFunction))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual({ id: 1, navn: 'Test' })
    expect(result.current.error).toBeNull()
  })

  it('setter error.message fra Error-objekt ved feil', async () => {
    const apiFunction = vi
      .fn()
      .mockRejectedValue(new Error('Noe gikk galt'))

    const { result } = renderHook(() => useFetch(apiFunction))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Noe gikk galt')
    expect(result.current.data).toBeNull()
  })

  it('setter generell feilmelding når kastet verdi ikke er et Error-objekt', async () => {
    const apiFunction = vi.fn().mockRejectedValue('en streng feil')

    const { result } = renderHook(() => useFetch(apiFunction))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(
      'Det skjedde en feil ved henting av data.'
    )
    expect(result.current.data).toBeNull()
  })

  it('setter generell feilmelding når kastet verdi er et tall', async () => {
    const apiFunction = vi.fn().mockRejectedValue(404)

    const { result } = renderHook(() => useFetch(apiFunction))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(
      'Det skjedde en feil ved henting av data.'
    )
  })
})
