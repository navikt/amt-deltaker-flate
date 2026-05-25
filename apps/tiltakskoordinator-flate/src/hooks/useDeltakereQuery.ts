import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { getDeltakere } from '../api/api'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../context-providers/FilterContext'
import {
  HandlingFilterValg,
  STATUS_FILTER_TYPER
} from '../utils/filter-deltakerliste'

export type DeltakereQueryKey = readonly [
  'deltakere',
  string,
  HandlingFilterValg[] | undefined,
  DeltakerStatusType[]
]

export const buildDeltakereQueryKey = (
  deltakerlisteId: string,
  valgteHendelseFilter: HandlingFilterValg[],
  valgteStatusFilter: DeltakerStatusType[]
): DeltakereQueryKey => {
  const statuser = STATUS_FILTER_TYPER.filter((status) =>
    valgteStatusFilter.includes(status)
  )
  const handlingFilterValg =
    valgteHendelseFilter.length > 0 ? valgteHendelseFilter : undefined
  return ['deltakere', deltakerlisteId, handlingFilterValg, statuser]
}

export const useDeltakereQuery = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { valgteHendelseFilter, valgteStatusFilter } = useFilterContext()

  const queryKey = buildDeltakereQueryKey(
    deltakerlisteDetaljer.id,
    valgteHendelseFilter,
    valgteStatusFilter
  )
  const [, , handlingFilterValg, statuser] = queryKey

  return useQuery({
    queryKey,
    queryFn: () =>
      getDeltakere(deltakerlisteDetaljer.id, { handlingFilterValg, statuser }),
    staleTime: 0,
    placeholderData: keepPreviousData
  })
}
