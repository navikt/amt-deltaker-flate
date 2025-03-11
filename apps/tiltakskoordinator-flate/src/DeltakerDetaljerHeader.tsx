import { BodyShort, Heading } from '@navikt/ds-react'
import { DeltakerDetaljer } from './api/data/deltaker'
import { DeltakerMarkering } from './components/DeltakerMarkering'
import { Fodselsnummer } from './components/Fodselsnummer'
import { lagDeltakerNavn } from './utils/utils'

interface Props {
  deltaker: DeltakerDetaljer | null
}

export const DeltakerDetaljerHeader = ({ deltaker }: Props) => {
  if (!deltaker) {
    return null
  }

  return (
    <div className="flex items-center flex-wrap gap-4">
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
  )
}

const HeaderSkille = () => (
  <BodyShort size="medium" className="text-[var(--a-text-subtle)]">
    /
  </BodyShort>
)
