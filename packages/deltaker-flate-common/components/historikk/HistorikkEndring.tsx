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
import { formatDate } from '../../utils/utils'
import { EMDASH } from '../../utils/constants'
import { DeltakelseInnholdListe } from '../DeltakelseInnholdListe'

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
        <BodyLong size="small">
          Årsak: {getDeltakerStatusAarsakText(endring.aarsak)}
        </BodyLong>
      )
    }
    case EndringType.ForlengDeltakelse: {
      return (
        <BodyLong size="small">
          NAVs begrunnelse: {endring.begrunnelse}
        </BodyLong>
      )
    }
    case EndringType.AvsluttDeltakelse: {
      return (
        <>
          <BodyLong size="small">
            Årsak: {getDeltakerStatusAarsakText(endring.aarsak)}
          </BodyLong>
          {endring.begrunnelse && (
            <BodyLong size="small">
              NAVs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
        </>
      )
    }
    case EndringType.EndreSluttdato: {
      return <div className="-mb-1" />
    }
    case EndringType.EndreBakgrunnsinformasjon: {
      return (
        <BodyLong size="small">
          {endring.bakgrunnsinformasjon || EMDASH}
        </BodyLong>
      )
    }
    case EndringType.EndreDeltakelsesmengde: {
      return (
        <BodyLong size="small">
          NAVs begrunnelse: {endring.begrunnelse}
        </BodyLong>
      )
    }
    case EndringType.EndreInnhold: {
      return (
        <DeltakelseInnholdListe
          deltakelsesinnhold={{ ledetekst: '', innhold: endring.innhold }}
          className="-mt-3 -mb-2"
        />
      )
    }
    case EndringType.ReaktiverDeltakelse: {
      return (
        <BodyLong size="small">
          NAVs begrunnelse: {endring.begrunnelse}
        </BodyLong>
      )
    }
    case EndringType.EndreSluttarsak: {
      return endring.begrunnelse ? (
        <BodyLong size="small">
          NAVs begrunnelse: {endring.begrunnelse}
        </BodyLong>
      ) : (
        <div className="-mb-1" />
      )
    }
    case EndringType.EndreStartdato: {
      return (
        <>
          <BodyLong size="small">
            Forventet sluttdato: {formatDate(endring.sluttdato)}
          </BodyLong>
          {endring.begrunnelse && (
            <BodyLong size="small">
              NAVs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
        </>
      )
    }
  }
}

export const HistorikkEndring = ({ deltakerEndring }: Props) => {
  const endreDeltakelsesType = mapEndringsType(deltakerEndring.endring.type)

  return (
    <HistorikkElement
      tittel={getEndringsTittel(deltakerEndring.endring)}
      icon={<EndringTypeIkon type={endreDeltakelsesType} size={'small'} />}
      forslag={deltakerEndring.forslag}
    >
      {getEndringsDetaljer(deltakerEndring.endring)}
      <Detail className="mt-1">{`Endret ${formatDate(deltakerEndring.endret)} ${deltakerEndring.endretAv} ${deltakerEndring.endretAvEnhet}`}</Detail>
    </HistorikkElement>
  )
}
