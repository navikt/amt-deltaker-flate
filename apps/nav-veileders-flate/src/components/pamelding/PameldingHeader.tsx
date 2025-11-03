import { ChevronRightIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import {
  erKursTiltak,
  hentTiltakGjennomforingNavnArrangorTittel,
  Oppstartstype
} from 'deltaker-flate-common'
import { Deltakerliste } from '../../api/data/pamelding.ts'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'

interface Props {
  title: string
  deltakerliste: Deltakerliste
}

export const PameldingHeader = ({ title, deltakerliste }: Props) => {
  const erKursMedLopendeOppstart =
    deltakerliste.oppstartstype === Oppstartstype.LOPENDE &&
    erKursTiltak(deltakerliste.tiltakstype)

  return (
    <div>
      <Heading level="1" size="large">
        {hentTiltakGjennomforingNavnArrangorTittel(
          deltakerliste.deltakerlisteNavn,
          deltakerliste.tiltakstype,
          deltakerliste.arrangorNavn
        )}
      </Heading>
      <Heading level="2" size="medium">
        {title}
      </Heading>
      {!deltakerliste.erEnkeltplassUtenRammeavtale && (
        <TiltaksgjennomforingLink
          deltakerlisteId={deltakerliste.deltakerlisteId}
        >
          <div className="flex mt-2">
            <BodyShort size="small">Gå til tiltaksgjennomføringen</BodyShort>
            <ChevronRightIcon aria-label="Gå til tiltaksgjennomføringen" />
          </div>
        </TiltaksgjennomforingLink>
      )}

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
