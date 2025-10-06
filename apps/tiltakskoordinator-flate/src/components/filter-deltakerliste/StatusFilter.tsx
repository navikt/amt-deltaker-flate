import {
  BodyShort,
  Checkbox,
  CheckboxGroup,
  ExpansionCard
} from '@navikt/ds-react'
import { Oppstartstype } from 'deltaker-flate-common'
import { useMemo } from 'react'
import useLocalStorage from '../../../../../packages/deltaker-flate-common/hooks/useLocalStorage'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../../context-providers/FilterContext'
import type { StatusFilterValg } from '../../utils/filter-deltakerliste'
import {
  getStatusFilterDetaljer,
  statuserForFellesOppstart,
  statuserForLopendeOppstart
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
          className="mt-[-0.5rem]"
          onChange={handleChange}
          value={valgteStatusFilter}
        >
          {filterDetaljer
            .filter((filter) => {
              return deltakerlisteDetaljer.oppstartstype ===
                Oppstartstype.LOPENDE
                ? statuserForLopendeOppstart.includes(filter.filtervalg)
                : statuserForFellesOppstart.includes(filter.filtervalg)
            })
            .map((filter) => (
              <Checkbox
                key={filter.filtervalg}
                value={filter.filtervalg}
                className="w-full [&_label_>_span]:w-full"
              >
                <span className="flex justify-between gap-4 w-full">
                  <span>{filter.navn}</span>
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
