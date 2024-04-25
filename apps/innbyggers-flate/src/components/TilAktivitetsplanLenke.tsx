import { BodyShort, Link } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { getAktivitetsplanUrl } from '../utils/environment-utils.ts'

interface TilAktivitetsplanLenkeProps {
  tekst?: string
}

export const TilAktivitetsplanLenke = ({
  tekst = 'Gå til aktivitetsplanen'
}: TilAktivitetsplanLenkeProps) => {
  return (
    <Link
      href={getAktivitetsplanUrl()}
      className="no-underline hover:underline mb-8"
    >
      <BodyShort size="small">{tekst}</BodyShort>
      <ArrowRightIcon aria-label="Gå til aktivitetsplanen" />
    </Link>
  )
}
