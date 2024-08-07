import { BodyLong, Detail } from '@navikt/ds-react'
import {
  DeltakerEndring,
  Endring,
  EndringType
} from '../../model/deltakerHistorikk'
import { EndreDeltakelseType } from '../../model/endre-deltaker'
import {
  getDeltakerStatusAarsakText,
  getEndringsTittel
} from '../../utils/displayText'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { HistorikkElement } from './HistorikkElement'
import { getForslagsDetaljer } from './HistorikkForslag'

interface Props {
  deltakerEndring: DeltakerEndring
}

const mapEndringsType = (endringType: EndringType) => {
  switch (endringType) {
    case EndringType.IkkeAktuell:
      return EndreDeltakelseType.IKKE_AKTUELL
    case EndringType.ForlengDeltakelse:
      return EndreDeltakelseType.FORLENG_DELTAKELSE
    case EndringType.AvsluttDeltakelse:
      return EndreDeltakelseType.AVSLUTT_DELTAKELSE
    case EndringType.EndreSluttdato:
      return EndreDeltakelseType.ENDRE_SLUTTDATO
    case EndringType.EndreBakgrunnsinformasjon:
      return EndreDeltakelseType.ENDRE_BAKGRUNNSINFO
    case EndringType.EndreDeltakelsesmengde:
      return EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE
    case EndringType.EndreInnhold:
      return EndreDeltakelseType.ENDRE_INNHOLD
    case EndringType.ReaktiverDeltakelse:
      return EndreDeltakelseType.REAKTIVER_DELTAKELSE
    case EndringType.EndreSluttarsak:
      return EndreDeltakelseType.ENDRE_SLUTTARSAK
    case EndringType.EndreStartdato:
      return EndreDeltakelseType.ENDRE_OPPSTARTSDATO
  }
}

const getEndringsDetaljer = (endring: Endring) => {
  switch (endring.type) {
    case EndringType.IkkeAktuell: {
      return (
        <BodyLong size="small" weight="semibold">
          Årsak: {getDeltakerStatusAarsakText(endring.aarsak)}
        </BodyLong>
      )
    }
    case EndringType.ForlengDeltakelse: {
      return <div></div>
    }
    case EndringType.AvsluttDeltakelse: {
      return <div></div>
    }
    case EndringType.EndreSluttdato: {
      return <div></div>
    }
    case EndringType.EndreBakgrunnsinformasjon: {
      return <div></div>
    }
    case EndringType.EndreDeltakelsesmengde: {
      return <div></div>
    }
    case EndringType.EndreInnhold: {
      return <div></div>
    }
    case EndringType.ReaktiverDeltakelse: {
      return <div></div>
    }
    case EndringType.EndreSluttarsak: {
      return <div></div>
    }
    case EndringType.EndreStartdato: {
      return <div></div>
    }
  }
}

export const HistorikkEndring = ({ deltakerEndring }: Props) => {
  const endreDeltakelsesType = mapEndringsType(deltakerEndring.endring.type)

  return (
    <HistorikkElement
      tittel={getEndringsTittel(deltakerEndring.endring)}
      icon={<EndringTypeIkon type={endreDeltakelsesType} size={'small'} />}
      forslag={
        deltakerEndring.forslag
          ? getForslagsDetaljer(deltakerEndring.forslag)
          : null
      }
    >
      {getEndringsDetaljer(deltakerEndring.endring)}
      <Detail size="small">{`Endret ${deltakerEndring.endret} ${deltakerEndring.endretAv} ${deltakerEndring.endretAvEnhet}`}</Detail>
    </HistorikkElement>
  )
}
