import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDeltakere } from '../api/api'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../context-providers/FilterContext'
import { STATUS_FILTER_TYPER } from '../utils/filter-deltakerliste'
import { DELTAKERE_QUERY_KEY } from '../api/tanstack-query-keys'

/**
 * Henter deltakere for gjeldende deltakerliste med aktive filtre.
 * staleTime: 0 betyr at data alltid refetches ved mount/focus.
 * placeholderData: keepPreviousData forhindrer at tabellen blinker ved filterbytte.
 */
export const useDeltakereQuery = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { valgteHendelseFilter, valgteStatusFilter } = useFilterContext()

  const statuser = STATUS_FILTER_TYPER.filter((status) =>
    valgteStatusFilter.includes(status)
  )
  const handlingFilterValg =
    valgteHendelseFilter.length > 0 ? valgteHendelseFilter : undefined

  const queryKey = [
    DELTAKERE_QUERY_KEY,
    deltakerlisteDetaljer.id,
    handlingFilterValg,
    statuser
  ]

  return useQuery({
    queryKey,
    queryFn: () =>
      getDeltakere(deltakerlisteDetaljer.id, { handlingFilterValg, statuser }),
    staleTime: 0,
    placeholderData: keepPreviousData
  })
}
