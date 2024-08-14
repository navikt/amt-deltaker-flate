import { BodyLong, Detail } from '@navikt/ds-react'
import {
  ArrangorEndring,
  ArrangorEndringsType,
  DeltakerEndringFraArrangor
} from '../../model/deltakerHistorikk'
import { EndreDeltakelseType } from '../../model/endre-deltaker'
import { formatDate, formatDateWithMonthName } from '../../utils/utils'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  deltakerEndringFraArrangor: DeltakerEndringFraArrangor
}

const mapEndringsType = (endringType: ArrangorEndringsType) => {
  switch (endringType) {
    case ArrangorEndringsType.LeggTilOppstartsdato:
      return EndreDeltakelseType.ENDRE_OPPSTARTSDATO
  }
}

const getEndringsTittel = (endring: ArrangorEndring) => {
  switch (endring.type) {
    case ArrangorEndringsType.LeggTilOppstartsdato:
      return `Oppstartsdato er ${formatDateWithMonthName(endring.startdato)}`
  }
}

const getEndringsDetaljer = (endring: ArrangorEndring) => {
  switch (endring.type) {
    case ArrangorEndringsType.LeggTilOppstartsdato:
      return (
        <BodyLong size="small">
          Forventet sluttdato: {formatDate(endring.sluttdato)}
        </BodyLong>
      )
  }
}

export const HistorikkArrangorEndring = ({
  deltakerEndringFraArrangor
}: Props) => {
  const endreDeltakelsesType = mapEndringsType(
    deltakerEndringFraArrangor.endring.type
  )

  return (
    <HistorikkElement
      tittel={getEndringsTittel(deltakerEndringFraArrangor.endring)}
      icon={<EndringTypeIkon type={endreDeltakelsesType} size={'small'} />}
      forslag={null}
    >
      {getEndringsDetaljer(deltakerEndringFraArrangor.endring)}
      <Detail className="mt-1">{`Endret ${formatDate(deltakerEndringFraArrangor.opprettet)} av ${deltakerEndringFraArrangor.arrangorNavn}`}</Detail>
    </HistorikkElement>
  )
}
