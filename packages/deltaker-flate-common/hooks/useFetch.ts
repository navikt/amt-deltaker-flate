import { useEffect, useState } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

type ApiFunction<T, U extends unknown[]> = (...args: U) => Promise<T>

export const useFetch = <T, U extends unknown[]>(
  apiFunction: ApiFunction<T, U>,
  ...args: U
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFunction(...args)
        setData(result)
      } catch (error) {
        setError('En feil oppsto ved henting av data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiFunction, ...args])

  return { data, loading, error }
}
