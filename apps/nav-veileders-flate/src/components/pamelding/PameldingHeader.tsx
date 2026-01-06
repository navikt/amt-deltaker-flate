import { ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading } from '@navikt/ds-react'
import { hentTiltakGjennomforingNavnArrangorTittel } from 'deltaker-flate-common'
import { Deltakerliste } from '../../api/data/pamelding.ts'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'

interface Props {
  title: string
  deltakerliste: Deltakerliste
}

export const PameldingHeader = ({ title, deltakerliste }: Props) => {
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
    </div>
  )
}
