import { BodyShort, Heading } from '@navikt/ds-react'
import { DeltakerDetaljer } from '../api/data/deltaker'
import { DeltakerMarkering } from './DeltakerMarkering'
import { Fodselsnummer } from './Fodselsnummer'
import { lagDeltakerNavn } from '../utils/utils'

interface Props {
  deltaker: DeltakerDetaljer | null
}

export const DeltakerDetaljerHeader = ({ deltaker }: Props) => {
  if (!deltaker) {
    return null
  }

  return (
    <div className="pt-4 pb-4 border-t border-b border-[var(--a-border-divider)]">
      <div className="flex items-center flex-wrap gap-2 pl-10 pr-10">
        <Heading level="2" size="small">
          {lagDeltakerNavn(
            deltaker.fornavn,
            deltaker.mellomnavn,
            deltaker.etternavn
          )}
        </Heading>
        <HeaderSkille />
        <Fodselsnummer fnr={deltaker.fodselsnummer} />
        <HeaderSkille />
        <DeltakerMarkering
          beskyttelsesmarkering={deltaker.beskyttelsesmarkering}
          innsatsgruppe={deltaker.innsatsgruppe}
        />
      </div>
    </div>
  )
}

const HeaderSkille = () => (
  <BodyShort size="medium" className="mr-2 ml-2 text-[var(--a-text-subtle)]">
    /
  </BodyShort>
)
