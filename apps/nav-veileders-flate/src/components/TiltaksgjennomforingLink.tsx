import { TILTAKSGJENNOMFORING_LINK, useModiaLink } from '../hooks/useModiaLink.ts'
import { Link } from '@navikt/ds-react'

interface Props {
  deltakerlisteId: string
  children: React.ReactNode
}

export const TiltaksgjennomforingLink = ({
  deltakerlisteId,
  children
}: Props) => {
  const {doRedirect} = useModiaLink()

  return (
    <Link
      className="no-underline hover:underline"
      href={`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`}
      onClick={(event) => {
        event.preventDefault()
        doRedirect(`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`)
      }}>
      {children}
    </Link>

  )
}
