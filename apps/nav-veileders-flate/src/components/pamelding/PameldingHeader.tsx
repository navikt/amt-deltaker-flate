import { ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading } from '@navikt/ds-react'
import {
  ArenaTiltakskode,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'

interface Props {
  title: string
  tiltakstype: ArenaTiltakskode
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
        {hentTiltakNavnHosArrangorTekst(tiltakstype, arrangorNavn)}
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
    </div>
  )
}
