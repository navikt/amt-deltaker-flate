import { BodyShort, Heading } from '@navikt/ds-react'
import { DeltakerDetaljer } from '../api/data/deltaker'
import { erAdresseBeskyttet, lagDeltakerNavn } from '../utils/utils'
import { DeltakerMarkering } from './DeltakerMarkering'
import { Fodselsnummer } from './Fodselsnummer'

interface Props {
  deltaker: DeltakerDetaljer | null
}

export const DeltakerDetaljerHeader = ({ deltaker }: Props) => {
  if (!deltaker) {
    return null
  }

  const adresseBeskyttet = erAdresseBeskyttet(deltaker.beskyttelsesmarkering)
  const navn = adresseBeskyttet
    ? 'Adressebeskyttet'
    : lagDeltakerNavn(deltaker.fornavn, deltaker.mellomnavn, deltaker.etternavn)

  return (
    <div className="pt-4 pb-4 border-t border-b border-[var(--a-border-divider)]">
      <div className="flex items-center flex-wrap gap-2 pl-10 pr-10">
        <Heading level="2" size="small">
          {navn}
        </Heading>
        <HeaderSkille />

        {!adresseBeskyttet && (
          <>
            <Fodselsnummer fnr={deltaker.fodselsnummer} />
            <HeaderSkille />
          </>
        )}

        <DeltakerMarkering
          beskyttelsesmarkering={deltaker.beskyttelsesmarkering}
          innsatsgruppe={deltaker.innsatsgruppe}
        />
      </div>
    </div>
  )
}

const HeaderSkille = () => (
  <BodyShort
    aria-hidden
    size="medium"
    className="mr-2 ml-2 text-[var(--a-text-subtle)]"
  >
    /
  </BodyShort>
)
