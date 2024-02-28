import {Tiltakstype} from '../../api/data/pamelding.ts'
import {Heading} from '@navikt/ds-react'
import { hentTiltakNavnHosArrangørTekst } from '../../utils/displayText.ts'

interface Props {
  title: string
  tiltakstype: Tiltakstype
  arrangorNavn: string
}

export const PameldingHeader = ({ title, tiltakstype, arrangorNavn }: Props) => {
  return (
    <div className="space-y-2">
      <Heading level="1" size="large">
        {title}
      </Heading>
      <Heading level="2" size="medium">
        {hentTiltakNavnHosArrangørTekst(tiltakstype, arrangorNavn)}
      </Heading>
    </div>
  )
}
