import { useState } from 'react'

export enum DeferredFetchState {
  NOT_STARTED = 'NOT_STARTED',
  LOADING = 'LOADING',
  RESOLVED = 'RESOLVED',
  ERROR = 'ERROR'
}

interface UseDeferredFetch<T, U extends unknown[]> {
  data: T | null
  state: DeferredFetchState
  error: string | null
  doFetch: (...args: U) => Promise<T | null>
}

export type ApiFunction<T, U extends unknown[]> = (...args: U) => Promise<T>

export const useDeferredFetch = <T, U extends unknown[]>(
  apiFunction: ApiFunction<T, U>,
  onResolved: (() => void) | undefined = undefined
): UseDeferredFetch<T, U> => {
  const [data, setData] = useState<T | null>(null)
  const [state, setState] = useState<DeferredFetchState>(
    DeferredFetchState.NOT_STARTED
  )
  const [error, setError] = useState<string | null>(null)

  const doFetch = async (...args: U): Promise<T | null> => {
    try {
      setState(DeferredFetchState.LOADING)
      const result = await apiFunction(...args)
      setData(result)
      setState(DeferredFetchState.RESOLVED)
      if (onResolved) onResolved()
      return result
    } catch (error) {
      setState(DeferredFetchState.ERROR)
      if (error as Error) {
        const e = error as Error
        setError(e.message)
      } else {
        setError('Det skjedde en feil ved henting av data.')
      }
      throw error
    }
  }

  return { data, state, error, doFetch }
}
