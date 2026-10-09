import { Link } from '@navikt/ds-react'

export const LenkeNyFane = ({
  url,
  tekst,
  inlineText = false
}: {
  url: string
  tekst: string
  inlineText?: boolean
}) => (
  <Link
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    inlineText={inlineText}
  >
    {tekst}
  </Link>
)
