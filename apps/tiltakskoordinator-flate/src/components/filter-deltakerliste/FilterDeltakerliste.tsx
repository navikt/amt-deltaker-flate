import {
  Checkbox,
  CheckboxGroup,
  ExpansionCard,
  Heading
} from '@navikt/ds-react'
import { useMemo } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import {
  FilterValg,
  getFilterMedDeltakere,
  getFiltrerteDeltakere
} from '../../utils/filter-deltakerliste'
import { useFilterContext } from '../../context-providers/FilterContext'
import useLocalStorage from '../../../../../packages/deltaker-flate-common/hooks/useLocalStorage'

interface Props {
  className?: string
}

export const FilterDeltakerliste = ({ className }: Props) => {
  const { deltakere, setFiltrerteDeltakere } = useDeltakerlisteContext()
  const { valgteFilter, setValgteFilter } = useFilterContext()
  const [filterOpen, setFilterOpen] = useLocalStorage<boolean>(
    'deltaker-liste-filter-hendelser-open'
  )

  const filterMedDeltakere = useMemo(() => {
    const filter = getFilterMedDeltakere(deltakere, valgteFilter)
    setFiltrerteDeltakere(
      valgteFilter.length > 0 ? getFiltrerteDeltakere(filter) : deltakere
    )
    return filter
  }, [valgteFilter, deltakere])

  const handleChange = (nyValgteFilter: string[]) => {
    setValgteFilter(
      nyValgteFilter
        .filter(
          (filter): filter is keyof typeof FilterValg => filter in FilterValg
        )
        .map((filter) => FilterValg[filter])
    )
  }

  return (
    <div className={className ? className : ''}>
      <Heading size="small" level="2" className="sr-only">
        Filtrer deltakerliste
      </Heading>

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
          <CheckboxGroup legend="" onChange={handleChange} value={valgteFilter}>
            {filterMedDeltakere.map((filter) => (
              <Checkbox
                key={filter.filtervalg}
                value={filter.filtervalg}
                className="flex justify-between"
              >
                <span>{filter.navn}</span>
                <span className="ml-4">{filter.filtrerteDeltakere.length}</span>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </ExpansionCard.Content>
      </ExpansionCard>
    </div>
  )
}
