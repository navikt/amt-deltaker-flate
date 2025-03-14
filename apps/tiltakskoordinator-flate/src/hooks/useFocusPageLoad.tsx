import { useEffect, useRef } from 'react'

export const useFocusPageLoad = (pageTitle: string) => {
  document.title = pageTitle

  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => ref.current?.focus(), [])

  return { ref }
}
