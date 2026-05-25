import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext'
import {
  DELTAKERE_QUERY_KEY,
  FILTER_COUNTS_QUERY_KEY
} from '../api/tanstack-query-keys'

/**
 * Returnerer en funksjon som invaliderer deltakere-queries og
 * filtertellinger for gjeldende deltakerliste.
 *
 * Brukes etter modal-handlinger som endrer deltakerstatus, slik at
 * tabellen og filtertellingene viser fersk data fra backend.
 */
export const useInvaliderDeltakere = () => {
  const queryClient = useQueryClient()
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const deltakerlisteId = deltakerlisteDetaljer.id
  const filterCountsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  return () => {
    void queryClient.invalidateQueries({
      queryKey: [DELTAKERE_QUERY_KEY, deltakerlisteId]
    })
    // vi henter tellinger fra amt-deltaker-bff, og det er et delay fra
    // amt-deltaker er oppdatert til amt-deltaker-bff er oppdatert,
    // så vi legger inn et lite delay før vi henter tellinger på nytt.
    // Ved gjentatte kall avbrytes forrige timer slik at vi kun henter én gang.
    if (filterCountsTimerRef.current) {
      clearTimeout(filterCountsTimerRef.current)
    }

    filterCountsTimerRef.current = setTimeout(() => {
      void queryClient.invalidateQueries({
        queryKey: [FILTER_COUNTS_QUERY_KEY, deltakerlisteId]
      })
      filterCountsTimerRef.current = null
    }, 1000)
  }
}
