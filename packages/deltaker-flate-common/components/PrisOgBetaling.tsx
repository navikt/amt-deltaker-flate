import { BodyLong, Heading } from '@navikt/ds-react'

interface Props {
  prisinformasjon?: string | null
  headinglevel: '2' | '3'
  headingsize?: 'medium' | 'small'
  className?: string
}

export const PrisOgBetaling = ({
  prisinformasjon,
  headinglevel,
  headingsize = 'medium',
  className
}: Props) => {
  if (!prisinformasjon) {
    return null
  }

  return (
    <div className={className ?? ''}>
      <Heading level={headinglevel} size={headingsize}>
        Pris og betalingsbetingelser
      </Heading>
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        {prisinformasjon}
      </BodyLong>
    </div>
  )
}
