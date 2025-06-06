import { BodyLong, Detail } from '@navikt/ds-react'
import {
  EndringerFraTiltakskoordinator,
  TiltakskoordinatorEndring,
  TiltakskoordinatorEndringsType
} from '../../model/deltakerHistorikk.ts'
import {
  getDeltakerStatusAarsakText,
  getTiltakskoordinatorEndringsTittel
} from '../../utils/displayText.ts'
import { formatDate } from '../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { HistorikkElement } from './HistorikkElement.tsx'

interface Props {
  tiltakskoordinatorEndring: EndringerFraTiltakskoordinator
}

const getEndringsDetaljer = (endring: TiltakskoordinatorEndring) => {
  switch (endring.type) {
    case TiltakskoordinatorEndringsType.DelMedArrangor:
      return (
        <BodyLong size="small">
          Informasjon om deltakelsen er sendt til arrangør for vurdering. Se
          “Dette deles med arrangøren” for mer informasjon om hva som er delt.
        </BodyLong>
      )
    case TiltakskoordinatorEndringsType.TildelPlass:
      return <BodyLong size="small">Du har fått plass på kurset.</BodyLong>
    case TiltakskoordinatorEndringsType.SettPaaVenteliste:
      return (
        <BodyLong size="small">
          Du har fått plass på ventelisten til kurset.
        </BodyLong>
      )
    case TiltakskoordinatorEndringsType.Avslag:
      return (
        <>
          <BodyLong size="small">
            Årsak: {getDeltakerStatusAarsakText(endring.aarsak)}
          </BodyLong>
          {endring.begrunnelse && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Navs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
        </>
      )
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
        {`Endret ${formatDate(tiltakskoordinatorEndring.endret)} av ${tiltakskoordinatorEndring.endretAv}${tiltakskoordinatorEndring.endretAvEnhet ? ' ' + tiltakskoordinatorEndring.endretAvEnhet : ''}.`}
      </Detail>
    </HistorikkElement>
  )
}
