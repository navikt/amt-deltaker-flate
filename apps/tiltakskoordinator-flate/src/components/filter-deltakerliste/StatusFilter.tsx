import {
  BodyShort,
  Checkbox,
  CheckboxGroup,
  ExpansionCard
} from '@navikt/ds-react'
import { useMemo } from 'react'
import useLocalStorage from '../../../../../packages/deltaker-flate-common/hooks/useLocalStorage'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../../context-providers/FilterContext'
import type { StatusFilterValg } from '../../utils/filter-deltakerliste'
import {
  getFilterStatuser,
  getStatusFilterDetaljer
} from '../../utils/filter-deltakerliste'

export const StatusFilter = () => {
  const { deltakere, deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { valgteStatusFilter, valgteHendelseFilter, setValgteStatusFilter } =
    useFilterContext()
  const [filterOpen, setFilterOpen] = useLocalStorage<boolean>(
    'deltaker-liste-filter-status-open',
    false
  )

  const filterDetaljer = useMemo(() => {
    return getStatusFilterDetaljer(
      deltakere,
      valgteStatusFilter,
      valgteHendelseFilter
    )
  }, [valgteStatusFilter, valgteHendelseFilter, deltakere])

  const filtre = useMemo(() => {
    return getFilterStatuser(
      deltakerlisteDetaljer.oppstartstype,
      deltakerlisteDetaljer.pameldingstype,
      deltakerlisteDetaljer.tiltakskode
    )
  }, [
    deltakerlisteDetaljer.oppstartstype,
    deltakerlisteDetaljer.pameldingstype,
    deltakerlisteDetaljer.tiltakskode
  ])

  const handleChange = (nyValgteFilter: string[]) => {
    setValgteStatusFilter(nyValgteFilter as StatusFilterValg[])
  }

  return (
    <ExpansionCard
      aria-label="Filtrer deltakerliste på hendelser"
      size="small"
      open={filterOpen}
      onToggle={(open: boolean) => setFilterOpen(open)}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title as="h2" size="small">
          Status
        </ExpansionCard.Title>
      </ExpansionCard.Header>

      <ExpansionCard.Content>
        <CheckboxGroup
          size="small"
          legend=""
          className="filter-checkboxes -mt-2"
          onChange={handleChange}
          value={valgteStatusFilter}
        >
          {filterDetaljer
            .filter((filter) => {
              return filtre.includes(filter.filtervalg)
            })
            .map((filter) => (
              <Checkbox key={filter.filtervalg} value={filter.filtervalg}>
                <span className="flex justify-between w-full gap-2">
                  <span className="whitespace-nowrap">{filter.navn}</span>
                  <BodyShort as="span" weight="semibold">
                    {filter.antall}
                  </BodyShort>
                </span>
              </Checkbox>
            ))}
        </CheckboxGroup>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
