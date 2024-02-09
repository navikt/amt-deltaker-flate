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
        setError(
          'An error occurred while fetching the data. Often due to frontend not being able to read the response'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiFunction, ...args])

  return { data, loading, error }
}

export default useFetch
