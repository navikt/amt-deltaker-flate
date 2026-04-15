import { BodyLong, GuidePanel, Heading } from '@navikt/ds-react'
import { svg } from '../ikoner/nav-veileder.tsx'

import {
  kanDeleDeltakerMedArrangorForVurdering,
  kreverGodkjenningForPamelding
} from '../utils/utils.ts'
import { hentTiltakEllerGjennomforingNavnHosArrangorTekst } from '../utils/displayText.ts'
import { Pameldingstype, Tiltakskode } from '../model/deltaker.ts'

interface Props {
  pameldingstype: Pameldingstype
  arrangorNavn: string
  tiltakskode: Tiltakskode
  deltakerlisteNavn: string
}
export const VeilederSnakkeboble = ({
  pameldingstype,
  arrangorNavn,
  tiltakskode,
  deltakerlisteNavn
}: Props) => {
  const erUtkastTilSoknad = kreverGodkjenningForPamelding(pameldingstype)
  const navnHosArrangorTekst = hentTiltakEllerGjennomforingNavnHosArrangorTekst(
    tiltakskode,
    deltakerlisteNavn,
    arrangorNavn
  )

  const kanDeleDeltakerMedArrangor = kanDeleDeltakerMedArrangorForVurdering(
    pameldingstype,
    tiltakskode
  )

  return (
    <GuidePanel illustration={svg}>
      <Heading level="3" size="small">
        {`Dette er et utkast til ${erUtkastTilSoknad ? 'søknad' : 'påmelding'} til ${navnHosArrangorTekst}`}
      </Heading>
      {erUtkastTilSoknad ? (
        <>
          <BodyLong className="mt-2">
            Før søknaden sendes, vil vi gjerne at du leser gjennom.
            {kanDeleDeltakerMedArrangor
              ? ' For å avgjøre hvem som skal få plass, kan Nav be om hjelp til vurdering fra arrangøren av kurset. Arrangør eller Nav vil kontakte deg hvis det er behov for et møte.'
              : ''}
          </BodyLong>
          <BodyLong className="mt-2">
            Hvis du godkjenner utkastet blir søknaden sendt inn.
          </BodyLong>
        </>
      ) : (
        <BodyLong className="mt-2">
          Før vi sender dette til {arrangorNavn} vil vi gjerne at du leser
          gjennom. Hvis du godkjenner utkastet blir du meldt på, vedtaket fattes
          og {arrangorNavn} mottar informasjon.
        </BodyLong>
      )}
    </GuidePanel>
  )
}
