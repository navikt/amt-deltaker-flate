import { BodyLong, Heading, Link, List } from '@navikt/ds-react'
import {
  IngenKostnaderAarsak,
  Prisinformasjon,
  PrisinformasjonType
} from '../model/prisinformasjon'
import { getPrisInformasjonTekst } from '../utils/displayText'
import { beregnEstimertTotalsum, NOK_FORMATTER } from '../utils/utils'

interface Props {
  prisinformasjon?: Prisinformasjon | null
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
  const renderPrisinformasjon = () => {
    switch (prisinformasjon.type) {
      case PrisinformasjonType.Anskaffelse:
        return (
          <>
            <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
              Nav har kjøpt en plass hos opplæringsstedet. Nav betaler for
              opplæringen.
            </BodyLong>
            <BodyLong size="small" className="mt-4 whitespace-pre-wrap">
              Totalkostnaden er {NOK_FORMATTER.format(prisinformasjon.pris)}{' '}
              kroner.
            </BodyLong>
          </>
        )
      case PrisinformasjonType.Tilskudd:
        return (
          <>
            <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
              Du kan få tilskudd til å dekke disse utgiftene:
            </BodyLong>
            <List className="mt-4">
              {prisinformasjon.tilskudd.map((tilskudd) => (
                <List.Item key={tilskudd.tilskudd}>
                  {getPrisInformasjonTekst(tilskudd.tilskudd)}:{' '}
                  {NOK_FORMATTER.format(tilskudd.belop)} kroner
                </List.Item>
              ))}
            </List>
            <BodyLong size="small" className="mt-4 whitespace-pre-wrap">
              Totalt anslått tilskudd:{' '}
              {NOK_FORMATTER.format(beregnEstimertTotalsum(prisinformasjon))}{' '}
              kroner.
            </BodyLong>
            <BodyLong size="small" className="mt-4 whitespace-pre-wrap">
              Utbetaling skjer når utgiftene er dokumentert.
            </BodyLong>

            {prisinformasjon.tilleggsopplysninger && (
              <BodyLong size="small" className="mt-4 whitespace-pre-wrap">
                {prisinformasjon.tilleggsopplysninger}
              </BodyLong>
            )}
          </>
        )
      case PrisinformasjonType.IngenKostnader:
        return (
          <>
            <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
              {prisinformasjon.aarsak ===
              IngenKostnaderAarsak.OPPLAERINGEN_ER_KOSTNADSFRI
                ? 'Du eller Nav skal ikke betale for opplæringen.'
                : 'Du må selv betale for opplæringen.'}
            </BodyLong>
            {prisinformasjon.tilleggsopplysninger && (
              <BodyLong size="small" className="mt-4 whitespace-pre-wrap">
                {prisinformasjon.tilleggsopplysninger}
              </BodyLong>
            )}
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className={className ?? ''}>
      <Heading level={headinglevel} size={headingsize}>
        Pris og betalingsbetingelser
      </Heading>

      {renderPrisinformasjon()}

      <BodyLong size="small" className="mt-4 whitespace-pre-wrap">
        Les mer om støtte til andre utgifter knyttet til opplæringen på{' '}
        <Link href="https://www.nav.no/tilleggsstonader">
          nav.no/tilleggsstønader
        </Link>
        .
      </BodyLong>
    </div>
  )
}
