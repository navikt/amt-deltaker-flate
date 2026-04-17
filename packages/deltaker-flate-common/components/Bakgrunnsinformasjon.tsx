import { BodyLong, Heading } from '@navikt/ds-react'
import { EMDASH } from '../utils/constants'

interface Props {
  bakgrunnsinformasjon: string | null
  headinglevel: '2' | '3'
  headingsize?: 'medium' | 'small'
  className?: string
}

export const Bakgrunnsinformasjon = ({
  bakgrunnsinformasjon,
  headinglevel,
  headingsize = 'medium',
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
      <Heading level={headinglevel} size={headingsize}>
        Bakgrunnsinfo
      </Heading>
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        {bakgrunnsinformasjon}
      </BodyLong>
    </div>
  )
}
