import { BodyLong, Heading } from '@navikt/ds-react'

interface Props {
  prisinformasjon?: string | null
  className?: string
}

export const PrisOgBetaling = ({ prisinformasjon, className }: Props) => {
  if (!prisinformasjon) {
    return null
  }

  return (
    <div className={className ?? ''}>
      <Heading level="2" size="medium">
        Pris og betalingsbetingelser
      </Heading>
      <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
        {prisinformasjon}
      </BodyLong>
    </div>
  )
}
