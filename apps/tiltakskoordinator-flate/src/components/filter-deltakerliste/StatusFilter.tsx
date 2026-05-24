import { getDeltakerStatusDisplayText } from 'deltaker-flate-common'
import { useMemo } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../../context-providers/FilterContext'
import { getFilterStatuser } from '../../utils/filter-deltakerliste'
import { FilterPanel } from './FilterPanel'

export const StatusFilter = () => {
  const { deltakerlisteDetaljer, statusCounts, filterCountsLaster } =
    useDeltakerlisteContext()
  const { valgteStatusFilter, setValgteStatusFilter } = useFilterContext()

  const filterAlternativer = useMemo(() => {
    return [
      ...new Set(
        getFilterStatuser(
          deltakerlisteDetaljer.oppstartstype,
          deltakerlisteDetaljer.pameldingstype,
          deltakerlisteDetaljer.tiltakskode
        )
      )
    ].map((filtervalg) => ({
      filtervalg,
      navn: getDeltakerStatusDisplayText(filtervalg)
    }))
  }, [
    deltakerlisteDetaljer.oppstartstype,
    deltakerlisteDetaljer.pameldingstype,
    deltakerlisteDetaljer.tiltakskode
  ])

  return (
    <FilterPanel
      tittel="Status"
      ariaLabel="Filtrer deltakerliste på status"
      localStorageKey="deltaker-liste-filter-status-open"
      filterAlternativer={filterAlternativer}
      valgteFilter={valgteStatusFilter}
      counts={statusCounts}
      filterCountsLaster={filterCountsLaster}
      onChange={(nyValgteFilter) => setValgteStatusFilter(nyValgteFilter)}
    />
  )
}
