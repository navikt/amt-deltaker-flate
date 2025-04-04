import { ChevronRightIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import {
  ArenaTiltakskode,
  erKursTiltak,
  hentTiltakNavnHosArrangorTekst,
  Oppstartstype
} from 'deltaker-flate-common'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'

interface Props {
  title: string
  tiltakstype: ArenaTiltakskode
  arrangorNavn: string
  deltakerlisteId: string
  oppstartstype: Oppstartstype
}

export const PameldingHeader = ({
  title,
  tiltakstype,
  arrangorNavn,
  deltakerlisteId,
  oppstartstype
}: Props) => {
  const label = oppstartstype === Oppstartstype.FELLES ? 'Kurs: ' : ''
  const erKursMedLopendeOppstart =
    oppstartstype === Oppstartstype.LOPENDE && erKursTiltak(tiltakstype)

  return (
    <div>
      <Heading level="1" size="large">
        {`${label}${hentTiltakNavnHosArrangorTekst(tiltakstype, arrangorNavn)}`}
      </Heading>
      <Heading level="2" size="medium">
        {title}
      </Heading>
      <TiltaksgjennomforingLink deltakerlisteId={deltakerlisteId}>
        <div className="flex mt-2">
          <BodyShort size="small">Gå til tiltaksgjennomføringen</BodyShort>
          <ChevronRightIcon aria-label="Gå til tiltaksgjennomføringen" />
        </div>
      </TiltaksgjennomforingLink>

      {erKursMedLopendeOppstart && (
        <Alert variant="info" size="small" className="mt-3">
          Dette tiltaket har løpende inntak, som betyr at det ikke utføres noen
          ytterligere vurdering av om deltakeren er kvalifisert for kurset før
          oppstart. Denne vurderingen må derfor utføres av Nav-veileder.
        </Alert>
      )}
    </div>
  )
}
