import { keepPreviousData, useQuery } from '@tanstack/react-query'

import useDebounce from './useDebounce'
import { sokUnderenhet } from '../api/api-enkeltplass'

// Søk etter org i Brønnøysundregisteret

export function useSokBrregUnderenhet(sokestreng: string, enhetId: string) {
  const debouncedSok = useDebounce(sokestreng, 300)

  return useQuery({
    queryKey: ['sokBrregUnderenhet', debouncedSok],
    queryFn: () => sokUnderenhet(debouncedSok.trim(), enhetId),
    enabled: debouncedSok.trim().length > 0,
    placeholderData: keepPreviousData,
    throwOnError: false
  })
}
