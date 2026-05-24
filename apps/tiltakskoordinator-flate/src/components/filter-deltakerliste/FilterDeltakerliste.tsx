import { Heading } from '@navikt/ds-react'
import { HendelseFilter } from './HendelseFilter'
import { StatusFilter } from './StatusFilter'

interface Props {
  className?: string
}

export const FilterDeltakerliste = ({ className }: Props) => {
  return (
    <div className={className ? className : ''}>
      <Heading size="small" level="2" className="sr-only">
        Filtrer deltakerliste
      </Heading>

      <div className="flex flex-col gap-4">
        <HendelseFilter />
        <StatusFilter />
      </div>
    </div>
  )
}
