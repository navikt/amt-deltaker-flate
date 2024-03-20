import { BodyShort, Link } from '@navikt/ds-react'
import { DELTAKELSESOVERSIKT_LINK, useModiaLink } from '../hooks/useModiaLink.ts'
import { ChevronLeftIcon } from '@navikt/aksel-icons'

interface TilbakeknappProps {
  tekst?: string
}

export const Tilbakeknapp = ({tekst = 'Tilbake'}: TilbakeknappProps) => {
  const {doRedirect} = useModiaLink()

  return (
    <Link
      href={DELTAKELSESOVERSIKT_LINK}
      className="no-underline hover:underline"
      onClick={(event) => {
        event.preventDefault()
        doRedirect(DELTAKELSESOVERSIKT_LINK)
      }}>
      <ChevronLeftIcon aria-label="Tilbakeknapp"/>
      <BodyShort size="small">{tekst}</BodyShort>
    </Link>
  )
}
