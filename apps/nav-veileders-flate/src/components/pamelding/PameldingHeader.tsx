import { Tiltakstype } from 'deltaker-flate-model'
import { BodyShort, Heading } from '@navikt/ds-react'
import { hentTiltakNavnHosArrangorTekst } from 'deltaker-flate-utils/displayText'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'
import { ChevronRightIcon } from '@navikt/aksel-icons'

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
    <div className="space-y-2">
      <Heading level="1" size="large">
        {title}
      </Heading>
      <Heading level="2" size="medium">
        {hentTiltakNavnHosArrangorTekst(tiltakstype, arrangorNavn)}
      </Heading>
      <TiltaksgjennomforingLink deltakerlisteId={deltakerlisteId}>
        <div className="flex">
          <BodyShort size="small">Gå til tiltaksgjennomføringen</BodyShort>
          <ChevronRightIcon aria-label="Gå til tiltaksgjennomføringen" />
        </div>
      </TiltaksgjennomforingLink>
    </div>
  )
}
