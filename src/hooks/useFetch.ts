import { useEffect } from 'react'
import { useState } from 'react'

type ApiFunction<T> = () => Promise<T>

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

const useFetch = <T>(apiFunction: ApiFunction<T>): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFunction()
        setData(result)
      } catch (error) {
        setError('An error occurred while fetching the data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiFunction])

  return { data, loading, error }
}

export default useFetch
