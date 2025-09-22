import {
  BodyShort,
  Checkbox,
  CheckboxGroup,
  ExpansionCard
} from '@navikt/ds-react'
import useLocalStorage from '../../../../../packages/deltaker-flate-common/hooks/useLocalStorage'

export type FilterDetaljer = {
  filtervalg: string
  valgt: boolean
  navn: string
  antall: number
}

interface Props<T> {
  navn: string
  storageKey: string
  className?: string
  valgteFilter?: T[]
  filterDetaljer: FilterDetaljer[]
  onChange: (nyValgteFilter: (T | string)[]) => void
}

export const FilterSection = <T,>({
  navn,
  storageKey,
  valgteFilter,
  filterDetaljer,
  onChange
}: Props<T>) => {
  const [filterOpen, setFilterOpen] = useLocalStorage<boolean>(
    storageKey,
    false
  )

  return (
    <ExpansionCard
      aria-label={`Filtrer deltakerliste på ${navn.toLowerCase()}`}
      size="small"
      open={filterOpen}
      onToggle={(open: boolean) => setFilterOpen(open)}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title as="h2" size="small">
          {navn}
        </ExpansionCard.Title>
      </ExpansionCard.Header>

      <ExpansionCard.Content>
        <CheckboxGroup
          size="small"
          legend=""
          className="mt-[-0.5rem]"
          onChange={onChange}
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
  )
}
