import { Link } from '@navikt/ds-react'
import { DELTAKELSESOVERSIKT_LINK, useModiaLink } from '../hooks/useModiaLink.ts'

interface TilbakeknappProps {
  tekst?: string
}

export const Tilbakeknapp = ({tekst = 'Tilbake'}: TilbakeknappProps) => {
  const {doRedirect} = useModiaLink()

  return (
    <Link
      href={DELTAKELSESOVERSIKT_LINK}
      onClick={(event) => {
        event.preventDefault()
        doRedirect(DELTAKELSESOVERSIKT_LINK)
      }}>
      {tekst}
    </Link>
  )
}
