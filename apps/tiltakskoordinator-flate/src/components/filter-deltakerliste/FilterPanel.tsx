import {
  BodyShort,
  Checkbox,
  CheckboxGroup,
  ExpansionCard
} from '@navikt/ds-react'
import useLocalStorage from '../../../../../packages/deltaker-flate-common/hooks/useLocalStorage'

interface FilterPanelProps<T extends string> {
  tittel: string
  ariaLabel: string
  localStorageKey: string
  filterAlternativer: { filtervalg: T; navn: string }[]
  valgteFilter: T[]
  counts: Partial<Record<T, number>>
  filterCountsLaster: boolean
  onChange: (nyValgteFilter: string[]) => void
}

export const FilterPanel = <T extends string>({
  tittel,
  ariaLabel,
  localStorageKey,
  filterAlternativer,
  valgteFilter,
  counts,
  filterCountsLaster,
  onChange
}: FilterPanelProps<T>) => {
  const [filterOpen, setFilterOpen] = useLocalStorage<boolean>(
    localStorageKey,
    false
  )

  return (
    <ExpansionCard
      aria-label={ariaLabel}
      size="small"
      open={filterOpen}
      onToggle={(open: boolean) => setFilterOpen(open)}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title as="h2" size="small">
          {tittel}
        </ExpansionCard.Title>
      </ExpansionCard.Header>

      <ExpansionCard.Content>
        <CheckboxGroup
          size="small"
          legend=""
          className="filter-checkboxes -mt-2"
          onChange={onChange}
          value={valgteFilter}
        >
          {filterAlternativer.map((filter) => (
            <Checkbox key={filter.filtervalg} value={filter.filtervalg}>
              <span className="flex justify-between w-full gap-2">
                <span className="whitespace-nowrap">{filter.navn}</span>
                <BodyShort as="span" weight="semibold">
                  {filterCountsLaster ? '-' : (counts[filter.filtervalg] ?? 0)}
                </BodyShort>
              </span>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
