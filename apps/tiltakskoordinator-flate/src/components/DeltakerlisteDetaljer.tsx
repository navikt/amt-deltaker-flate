import { PersonIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail, List } from '@navikt/ds-react'
import { formatDate } from 'deltaker-flate-common'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext.tsx'

export const DeltakerlisteDetaljer = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()

  return (
    <div className="md:w-1/5 w-full mt-14">
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
          <List.Item key={koordinator.id} icon={<PersonIcon aria-hidden />}>
            {koordinator.navn}
          </List.Item>
        ))}
      </List>
    </div>
  )
}
