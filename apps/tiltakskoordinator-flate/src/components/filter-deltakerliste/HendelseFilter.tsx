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
import {
  HandlingFilterValg,
  getHandlingFilterDetaljer
} from '../../utils/filter-deltakerliste'

export const HendelseFilter = () => {
  const { deltakere } = useDeltakerlisteContext()
  const {
    valgteHandlingerFilter,
    valgteStatusFilter,
    setValgteHandlingerFilter
  } = useFilterContext()
  const [filterOpen, setFilterOpen] = useLocalStorage<boolean>(
    'deltaker-liste-filter-hendelser-open',
    false
  )

  const filterDetaljer = useMemo(() => {
    return getHandlingFilterDetaljer(
      deltakere,
      valgteHandlingerFilter,
      valgteStatusFilter
    )
  }, [valgteHandlingerFilter, valgteStatusFilter, deltakere])

  const handleChange = (nyValgteFilter: string[]) => {
    setValgteHandlingerFilter(
      nyValgteFilter
        .filter(
          (filter): filter is keyof typeof HandlingFilterValg =>
            filter in HandlingFilterValg
        )
        .map((filter) => HandlingFilterValg[filter])
    )
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
          Hendelser
        </ExpansionCard.Title>
      </ExpansionCard.Header>

      <ExpansionCard.Content>
        <CheckboxGroup
          size="small"
          legend=""
          className="mt-[-0.5rem]"
          onChange={handleChange}
          value={valgteHandlingerFilter}
        >
          {filterDetaljer.map((filter) => (
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
