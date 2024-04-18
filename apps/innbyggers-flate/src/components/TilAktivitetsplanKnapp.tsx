import { BodyShort, Link } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'

interface TilAktivitetsplanKnappProps {
  tekst?: string
}

export const TilAktivitetsplanKnapp = ({
  tekst = 'Gå til aktivitetsplanen'
}: TilAktivitetsplanKnappProps) => {
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
