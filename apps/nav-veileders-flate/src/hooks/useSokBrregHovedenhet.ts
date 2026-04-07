import { keepPreviousData, useQuery } from '@tanstack/react-query'

import useDebounce from './useDebounce'
import { getUnderenheter, sokHovedenhet } from '../api/api-enkeltplass'

// Søk etter org i Brønnøysundregisteret

export function useSokBrregHovedenhet(sokestreng: string, enhetId: string) {
  const debouncedSok = useDebounce(sokestreng, 300)

  return useQuery({
    queryKey: ['sokBrregHovedenhet', debouncedSok],
    queryFn: () => sokHovedenhet(debouncedSok, enhetId),
    enabled: !!debouncedSok,
    placeholderData: keepPreviousData
  })
}

export function useBrregUnderenheter(orgnr: string, enhetId: string) {
  return useQuery({
    queryKey: ['getBrregUnderenheter', orgnr],
    queryFn: () => getUnderenheter(orgnr, enhetId),
    enabled: !!orgnr
  })
}
