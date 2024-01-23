import { useState } from 'react'

export enum DeferredFetchState {
    NOT_STARTED = 'NOT_STARTED',
    LOADING = 'LOADING',
    RESOLVED = 'RESOLVED',
    ERROR = 'ERROR'
}

interface UseDeferredFetch<T> {
    data: T | null,
    state: DeferredFetchState,
    error: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doFetch: (...args: any[]) => Promise<T | null>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiFunction<T> = (...args: any[]) => Promise<T>

export const useDeferredFetch = <T>(apiFunction: ApiFunction<T>, onResolved: (() => void) | undefined = undefined): UseDeferredFetch<T> => {
  const [data, setData] = useState<T | null>(null)
  const [state, setState] = useState<DeferredFetchState>(DeferredFetchState.NOT_STARTED)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doFetch = async (...args: any[]): Promise<T | null> => {
    try {
      setState(DeferredFetchState.LOADING)
      const result = await apiFunction(...args)
      setData(result)
      setState(DeferredFetchState.RESOLVED)
      if (onResolved) onResolved()
      return result
    } catch (error) {
      setState(DeferredFetchState.ERROR)
      setError(`Skjedde en feil ved henting av data: ${error}`)
      throw error
    }
  }

  return {data, state, error, doFetch}
}
