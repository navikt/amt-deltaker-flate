import { Heading } from '@navikt/ds-react'
import { useEffect, useMemo } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../../context-providers/FilterContext'
import { getFiltrerteDeltakere } from '../../utils/filter-deltakerliste'
import { HendelseFilter } from './HendelseFilter'
import { StatusFilter } from './StatusFilter'
import { Oppstartstype } from 'deltaker-flate-common'

interface Props {
  className?: string
}

export const FilterDeltakerliste = ({ className }: Props) => {
  const { deltakere, deltakerlisteDetaljer, setFiltrerteDeltakere } =
    useDeltakerlisteContext()
  const { valgteHendelseFilter, valgteStatusFilter } = useFilterContext()
  const erFellesOppstart =
    deltakerlisteDetaljer.oppstartstype === Oppstartstype.FELLES

  const filtrerteDeltakere = useMemo(() => {
    return getFiltrerteDeltakere(
      deltakere,
      valgteHendelseFilter,
      valgteStatusFilter
    )
  }, [valgteHendelseFilter, valgteStatusFilter, deltakere])

  useEffect(() => {
    setFiltrerteDeltakere(filtrerteDeltakere)
  }, [filtrerteDeltakere, setFiltrerteDeltakere])

  return (
    <div className={className ? className : ''}>
      <Heading size="small" level="2" className="sr-only">
        Filtrer deltakerliste
      </Heading>

      <div className="flex flex-col gap-4">
        <HendelseFilter />

        {erFellesOppstart && <StatusFilter />}
      </div>
    </div>
  )
}
