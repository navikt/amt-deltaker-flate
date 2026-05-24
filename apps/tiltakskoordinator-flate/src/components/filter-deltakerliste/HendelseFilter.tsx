import { kreverGodkjenningForPamelding } from 'deltaker-flate-common'
import { useMemo } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../../context-providers/FilterContext'
import {
  HandlingFilterValg,
  getHandlingFilterTypeNavn
} from '../../utils/filter-deltakerliste'
import { FilterPanel } from './FilterPanel'

export const HendelseFilter = () => {
  const { deltakerlisteDetaljer, handlingCounts, filterCountsLaster } =
    useDeltakerlisteContext()
  const { valgteHendelseFilter, setValgteHendelseFilter } = useFilterContext()

  const filterAlternativer = useMemo(() => {
    return Object.values(HandlingFilterValg)
      .filter((filterValg) =>
        kreverGodkjenningForPamelding(deltakerlisteDetaljer.pameldingstype)
          ? true
          : filterValg === HandlingFilterValg.AktiveForslag
      )
      .map((filterValg) => ({
        filtervalg: filterValg,
        navn: getHandlingFilterTypeNavn(filterValg)
      }))
  }, [deltakerlisteDetaljer.pameldingstype])

  return (
    <FilterPanel
      tittel="Hendelser"
      ariaLabel="Filtrer deltakerliste på hendelser"
      localStorageKey="deltaker-liste-filter-hendelser-open"
      filterAlternativer={filterAlternativer}
      valgteFilter={valgteHendelseFilter}
      counts={handlingCounts}
      filterCountsLaster={filterCountsLaster}
      onChange={(nyValgteFilter) =>
        setValgteHendelseFilter(nyValgteFilter as HandlingFilterValg[])
      }
    />
  )
}
