import { BodyShort, Detail, List } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../DeltakerlisteContext'
import { formatDate } from 'deltaker-flate-common'
import { PersonIcon } from '@navikt/aksel-icons'

export const DeltakerlisteDetaljer = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()

  return (
    <div>
      <Detail weight="semibold">Start- sluttdato</Detail>
      <BodyShort size="small">
        {formatDate(deltakerlisteDetaljer.startdato)} -{' '}
        {formatDate(deltakerlisteDetaljer.sluttdato)}
      </BodyShort>

      <Detail weight="semibold" className="mt-3">
        Antall plasser
      </Detail>
      <BodyShort size="small">{deltakerlisteDetaljer.antallPlasser}</BodyShort>

      <Detail weight="semibold" className="mt-3">
        Åpent for påmelding
      </Detail>
      <BodyShort size="small">
        {deltakerlisteDetaljer.apentForPamelding ? 'Ja' : 'Nei'}
      </BodyShort>
      <Detail weight="semibold" className="mt-3">
        Koordinator for deltakerliste:
      </Detail>
      <List as="ul" size="small">
        {deltakerlisteDetaljer.koordinatorer.map((koordinator) => (
          <BodyShort key={koordinator.id}>
            <PersonIcon className="inline" title="Koordinators navn" />{' '}
            {koordinator.navn}
          </BodyShort>
        ))}
      </List>
    </div>
  )
}
