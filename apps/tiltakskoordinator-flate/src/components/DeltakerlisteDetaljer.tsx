import { BodyLong, BodyShort, Detail, Link, List } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext.tsx'
import { formatDate } from 'deltaker-flate-common'
import { useParams } from 'react-router-dom'
import { TILTAKSANSVARLIG_URL } from '../../utils/environment-utils.ts'
import { ExternalLinkIcon, PersonIcon } from '@navikt/aksel-icons'

export const DeltakerlisteDetaljer = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { deltakerlisteId } = useParams()
  const endringsmeldingerLenke = `${TILTAKSANSVARLIG_URL}/gjennomforing/${deltakerlisteId}`

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
      <div className="mt-6">
        <BodyLong size="small">
          For å se vurderinger og endringsmeldinger må du foreløpig bruke den
          gamle oversikten.
        </BodyLong>
        <Link href={endringsmeldingerLenke} className="mt-3">
          Se endringsmeldinger
          <ExternalLinkIcon fontSize="1.5rem" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
