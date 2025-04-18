import { BodyLong, Detail } from '@navikt/ds-react'
import {
  EndringerFraTiltakskoordinator,
  TiltakskoordinatorEndring,
  TiltakskoordinatorEndringsType
} from '../../model/deltakerHistorikk.ts'
import { getTiltakskoordinatorEndringsTittel } from '../../utils/displayText.ts'
import { formatDate } from '../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { HistorikkElement } from './HistorikkElement.tsx'

interface Props {
  tiltakskoordinatorEndring: EndringerFraTiltakskoordinator
}

const getEndringsDetaljer = (endring: TiltakskoordinatorEndring) => {
  switch (endring.type) {
    case TiltakskoordinatorEndringsType.DelMedArrangor: {
      return (
        <BodyLong size="small">
          Informasjon om deltakelsen er sendt til arrangør for vurdering. Se
          “Dette deles med arrangøren” for mer informasjon om hva som er delt.
        </BodyLong>
      )
    }
  }
}

export const HistorikkTiltakskoordinatorEndring = ({
  tiltakskoordinatorEndring
}: Props) => {
  const endringsType = tiltakskoordinatorEndring.endring.type

  return (
    <HistorikkElement
      tittel={getTiltakskoordinatorEndringsTittel(endringsType)}
      icon={<EndringTypeIkon type={endringsType} size={'small'} />}
    >
      {getEndringsDetaljer(tiltakskoordinatorEndring.endring)}
      <Detail className="mt-1" textColor="subtle">
        {`Endret ${formatDate(tiltakskoordinatorEndring.endret)} av ${tiltakskoordinatorEndring.endretAv}.`}
      </Detail>
    </HistorikkElement>
  )
}
