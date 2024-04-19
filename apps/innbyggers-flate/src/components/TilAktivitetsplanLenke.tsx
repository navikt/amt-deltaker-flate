import { BodyShort, Link } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'

interface TilAktivitetsplanLenkeProps {
  tekst?: string
}

export const TilAktivitetsplanLenke = ({
  tekst = 'Gå til aktivitetsplanen'
}: TilAktivitetsplanLenkeProps) => {
  return (
    <Link
      href={import.meta.env.VITE_AKTIVITETSPLAN_URL}
      className="no-underline hover:underline mb-4"
    >
      <BodyShort size="small">{tekst}</BodyShort>
      <ArrowRightIcon aria-label="Gå til aktivitetsplanen" />
    </Link>
  )
}
