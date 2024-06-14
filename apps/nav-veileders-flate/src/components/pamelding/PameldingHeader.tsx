import { ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading } from '@navikt/ds-react'
import {
  Tiltakstype,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'

interface Props {
  title: string
  tiltakstype: Tiltakstype
  arrangorNavn: string
  deltakerlisteId: string
}

export const PameldingHeader = ({
  title,
  tiltakstype,
  arrangorNavn,
  deltakerlisteId
}: Props) => {
  return (
    <div>
      <Heading level="1" size="large">
        {title}
      </Heading>
      <Heading level="2" size="medium">
        {hentTiltakNavnHosArrangorTekst(tiltakstype, arrangorNavn)}
      </Heading>
      <TiltaksgjennomforingLink deltakerlisteId={deltakerlisteId}>
        <div className="flex mt-2">
          <BodyShort size="small">Gå til tiltaksgjennomføringen</BodyShort>
          <ChevronRightIcon aria-label="Gå til tiltaksgjennomføringen" />
        </div>
      </TiltaksgjennomforingLink>
    </div>
  )
}
