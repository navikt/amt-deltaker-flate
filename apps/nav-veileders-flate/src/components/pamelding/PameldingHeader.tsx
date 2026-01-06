import { ChevronRightIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import {
  erKursTiltak,
  hentTiltakGjennomforingNavnArrangorTittel,
  kanMeldePaaDirekte,
  Oppstartstype
} from 'deltaker-flate-common'
import { Deltakerliste } from '../../api/data/pamelding.ts'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'

interface Props {
  title: string
  deltakerliste: Deltakerliste
}

export const PameldingHeader = ({ title, deltakerliste }: Props) => {
  const erKursMedLopendeOppstartPameldesDirekte =
    deltakerliste.oppstartstype === Oppstartstype.LOPENDE &&
    erKursTiltak(deltakerliste.tiltakskode) &&
    kanMeldePaaDirekte(deltakerliste.pameldingstype)

  return (
    <div>
      <Heading level="1" size="large">
        {hentTiltakGjennomforingNavnArrangorTittel(
          deltakerliste.deltakerlisteNavn,
          deltakerliste.tiltakskode,
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

      {erKursMedLopendeOppstartPameldesDirekte && (
        <Alert variant="info" size="small" className="mt-3">
          <Heading spacing size="xsmall" level="3">
            Ved å fullføre denne påmeldingen fatter du også vedtaket om
            tiltaksplass
          </Heading>
          Nav gjør ingen ytterligere vurdering av om deltakeren oppfyller
          kravene for å delta i tiltaket. Deltakeren får vedtak og informasjonen
          deles med arrangøren.
        </Alert>
      )}
    </div>
  )
}
