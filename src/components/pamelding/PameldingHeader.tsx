import {Tiltakstype} from '../../api/data/pamelding.ts'
import {Heading} from '@navikt/ds-react'
import {getTiltakstypeDisplayText} from '../../utils/displayText.ts'

interface Props {
    tiltakstype: Tiltakstype
    arrangorNavn: string
}

export const PameldingHeader = ({tiltakstype, arrangorNavn}: Props) => {
  return (
    <div className="space-y-4 mb-4">
      <Heading level="1" size="large">Påmelding</Heading>
      <Heading level="2" size="medium">{getTiltakstypeDisplayText(tiltakstype)} hos {arrangorNavn}</Heading>
    </div>
  )
}
