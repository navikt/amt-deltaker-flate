import { useEffect, useState } from 'react'

const useLocalStorage = <T>(
  storageKey: string,
  fallbackState?: T | null
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const localStorageItem = localStorage.getItem(storageKey)
    return localStorageItem
      ? JSON.parse(localStorageItem)
      : (fallbackState ?? null)
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value))
  }, [value, storageKey])

  return [value, setValue]
}

export default useLocalStorage
