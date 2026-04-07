import { useQuery } from '@tanstack/react-query'

import useDebounce from './useDebounce'
import { sokHovedEnhet } from '../api/api-enkeltplass'

export function useSokBrregHovedenhet(sokestreng: string, enhetId: string) {
  const debouncedSok = useDebounce(sokestreng, 300)

  return useQuery({
    queryKey: ['sokBrregHovedenhet', debouncedSok],
    queryFn: () => sokHovedEnhet(debouncedSok, enhetId),
    enabled: !!debouncedSok
  })
}
