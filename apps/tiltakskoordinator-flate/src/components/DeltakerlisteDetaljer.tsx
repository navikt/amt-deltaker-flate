import { BodyShort, Detail } from '@navikt/ds-react'
import { formatDate } from 'deltaker-flate-common'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext.tsx'
import { KoordinatorListe } from './deltaker-liste-detaljer/KoordinatorListe.tsx'

export const DeltakerlisteDetaljer = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()

  return (
    <div className="mt-14">
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
        Koordinatorer for deltakerliste:
      </Detail>
      <KoordinatorListe
        deltakerlisteId={deltakerlisteDetaljer.id}
        koordinatorer={deltakerlisteDetaljer.koordinatorer}
      />
    </div>
  )
}
