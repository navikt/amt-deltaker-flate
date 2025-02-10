import {
  BodyLong,
  BodyShort,
  Button,
  Detail,
  Link,
  List
} from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../DeltakerlisteContext'
import { formatDate } from 'deltaker-flate-common'
import { useParams } from 'react-router-dom'
import { TILTAKSANSVARLIG_FLATE_URL } from '../../utils/environment-utils.ts'

export const DeltakerlisteDetaljer = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { deltakerlisteId } = useParams()
  const endringsmeldingerLenke = `https://${TILTAKSANSVARLIG_FLATE_URL}/gjennomforing/${deltakerlisteId}`

  return (
    <div className="w-1/5">
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
          <List.Item key={koordinator.id}>{koordinator.navn}</List.Item>
        ))}
      </List>
      <div className="mt-6">
        <BodyLong>
          For å se vurderinger og endringsmeldinger må du foreløpig bruke den
          gamle oversikten.
        </BodyLong>
        <Link href={endringsmeldingerLenke} className="mt-3">
          <Button size="small" variant="secondary" as="a">
            Se endringsmeldinger
          </Button>
        </Link>
      </div>
    </div>
  )
}
