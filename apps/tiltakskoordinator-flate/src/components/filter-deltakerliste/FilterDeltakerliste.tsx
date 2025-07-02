import {
  BodyShort,
  Checkbox,
  CheckboxGroup,
  ExpansionCard,
  Heading
} from '@navikt/ds-react'
import { useMemo } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import {
  FilterValg,
  getFilterDetaljer,
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
    'deltaker-liste-filter-hendelser-open',
    true
  )

  const filterDetaljer = useMemo(() => {
    setFiltrerteDeltakere(
      valgteFilter.length > 0
        ? getFiltrerteDeltakere(deltakere, valgteFilter)
        : deltakere
    )
    return getFilterDetaljer(deltakere, valgteFilter)
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
          <CheckboxGroup
            size="small"
            legend=""
            className="mt-[-0.5rem]"
            onChange={handleChange}
            value={valgteFilter}
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
    </div>
  )
}
