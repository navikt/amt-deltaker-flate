import {
  BodyShort,
  Checkbox,
  CheckboxGroup,
  ExpansionCard
} from '@navikt/ds-react'
import { kreverGodkjenningForPamelding } from 'deltaker-flate-common'
import { useMemo } from 'react'
import useLocalStorage from '../../../../../packages/deltaker-flate-common/hooks/useLocalStorage'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../../context-providers/FilterContext'
import {
  HandlingFilterValg,
  getHandlingFilterTypeNavn
} from '../../utils/filter-deltakerliste'

export const HendelseFilter = () => {
  const { deltakerlisteDetaljer, handlingCounts } = useDeltakerlisteContext()
  const { valgteHendelseFilter, setValgteHendelseFilter } = useFilterContext()
  const [filterOpen, setFilterOpen] = useLocalStorage<boolean>(
    'deltaker-liste-filter-hendelser-open',
    false
  )

  const filterDetaljer = useMemo(() => {
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

  const handleChange = (nyValgteFilter: string[]) => {
    setValgteHendelseFilter(
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
          className="filter-checkboxes -mt-2"
          onChange={handleChange}
          value={valgteHendelseFilter}
        >
          {filterDetaljer.map((filter) => (
            <Checkbox key={filter.filtervalg} value={filter.filtervalg}>
              <span className="flex justify-between w-full gap-2">
                <span className="whitespace-nowrap">{filter.navn}</span>
                <BodyShort as="span" weight="semibold">
                  {handlingCounts[filter.filtervalg] ?? 0}
                </BodyShort>
              </span>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
