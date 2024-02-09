import { useEffect, useState } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiFunction<T> = (...args: any[]) => Promise<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFetch = <T>(apiFunction: ApiFunction<T>, ...args: any[]): UseFetchResult<T> => {
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

export default useFetch
