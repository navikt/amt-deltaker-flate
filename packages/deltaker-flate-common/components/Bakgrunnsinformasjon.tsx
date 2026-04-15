import { BodyLong, Heading } from '@navikt/ds-react'
import { EMDASH } from '../utils/constants'

interface Props {
  bakgrunnsinformasjon: string | null
  className?: string
}

export const Bakgrunnsinformasjon = ({
  bakgrunnsinformasjon,
  className
}: Props) => {
  if (
    !bakgrunnsinformasjon ||
    bakgrunnsinformasjon.trim().length === 0 ||
    bakgrunnsinformasjon === EMDASH
  ) {
    return null
  }

  return (
    <div className={className ?? ''}>
      <Heading level="2" size="medium">
        Bakgrunnsinfo
      </Heading>
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        {bakgrunnsinformasjon}
      </BodyLong>
    </div>
  )
}
