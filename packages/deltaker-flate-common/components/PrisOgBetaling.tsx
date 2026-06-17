import { BodyLong, Heading } from '@navikt/ds-react'
import { Prisinformasjon } from '../model/prisinformasjon'

interface Props {
  prisinformasjon?: string | null | Prisinformasjon
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

  // TODO vis ut prisinformasjonen

  return (
    <div className={className ?? ''}>
      <Heading level={headinglevel} size={headingsize}>
        Pris og betalingsbetingelser
      </Heading>
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        {typeof prisinformasjon === 'string'
          ? prisinformasjon
          : JSON.stringify(prisinformasjon, null, 2)}
      </BodyLong>
    </div>
  )
}
