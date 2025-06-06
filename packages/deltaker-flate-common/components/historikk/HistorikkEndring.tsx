import { BodyLong, BodyShort, Detail } from '@navikt/ds-react'
import {
  DeltakerEndring,
  Endring,
  EndringType
} from '../../model/deltakerHistorikk'
import { EndreDeltakelseType } from '../../model/endre-deltaker'
import { EMDASH } from '../../utils/constants'
import {
  getDeltakerStatusAarsakText,
  getEndringsTittel
} from '../../utils/displayText'
import { formatDate } from '../../utils/utils'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { HistorikkElement } from './HistorikkElement'
import { ArenaTiltakskode, Oppstartstype } from '../../model/deltaker.ts'

interface Props {
  deltakerEndring: DeltakerEndring
  tiltakstype: ArenaTiltakskode
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
    case EndringType.FjernOppstartsdato:
      return EndreDeltakelseType.FJERN_OPPSTARTSDATO
  }
}

const getEndringsDetaljer = (
  endring: Endring,
  tiltakstype: ArenaTiltakskode
) => {
  switch (endring.type) {
    case EndringType.IkkeAktuell: {
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
    case EndringType.AvsluttDeltakelse: {
      return (
        <>
          {endring.aarsak && (
            <BodyLong size="small">
              Årsak: {getDeltakerStatusAarsakText(endring.aarsak)}
            </BodyLong>
          )}
          {endring.oppstartstype === Oppstartstype.FELLES && (
            <BodyLong size="small">
              Er kurset fullført: {endring.harFullfort ? 'Ja' : 'Nei'}
            </BodyLong>
          )}
          {endring.begrunnelse && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Navs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
        </>
      )
    }
    case EndringType.EndreBakgrunnsinformasjon: {
      return (
        <BodyLong size="small" className="whitespace-pre-wrap">
          {endring.bakgrunnsinformasjon || EMDASH}
        </BodyLong>
      )
    }
    case EndringType.EndreInnhold: {
      return (
        <DeltakelseInnhold
          tiltakstype={tiltakstype}
          deltakelsesinnhold={{
            ledetekst: endring.ledetekst || null,
            innhold: endring.innhold
          }}
          listClassName="-mt-3 -mb-2"
          heading={null}
        />
      )
    }
    case EndringType.ReaktiverDeltakelse: {
      return (
        <BodyLong size="small" className="whitespace-pre-wrap">
          Navs begrunnelse: {endring.begrunnelse}
        </BodyLong>
      )
    }
    case EndringType.EndreDeltakelsesmengde:
      return (
        <>
          {endring.gyldigFra && (
            <BodyShort size="small">
              Gjelder fra: {formatDate(endring.gyldigFra)}
            </BodyShort>
          )}
          {endring.begrunnelse && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Navs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
        </>
      )
    case EndringType.ForlengDeltakelse:
    case EndringType.EndreSluttdato:
    case EndringType.EndreSluttarsak: {
      return endring.begrunnelse ? (
        <BodyLong size="small" className="whitespace-pre-wrap">
          Navs begrunnelse: {endring.begrunnelse}
        </BodyLong>
      ) : (
        <div className="-mb-1" />
      )
    }
    case EndringType.EndreStartdato: {
      return (
        <>
          {endring.sluttdato && (
            <BodyLong size="small">
              Forventet sluttdato: {formatDate(endring.sluttdato)}
            </BodyLong>
          )}
          {endring.begrunnelse && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Navs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
        </>
      )
    }
    case EndringType.FjernOppstartsdato: {
      return (
        <>
          {endring.begrunnelse && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Navs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
        </>
      )
    }
  }
}

export const HistorikkEndring = ({ deltakerEndring, tiltakstype }: Props) => {
  const endreDeltakelsesType = mapEndringsType(deltakerEndring.endring.type)

  return (
    <HistorikkElement
      tittel={getEndringsTittel(deltakerEndring.endring)}
      icon={<EndringTypeIkon type={endreDeltakelsesType} size={'small'} />}
      forslag={deltakerEndring.forslag}
    >
      {getEndringsDetaljer(deltakerEndring.endring, tiltakstype)}
      <Detail className="mt-1" textColor="subtle">
        {`Endret ${formatDate(deltakerEndring.endret)} av ${deltakerEndring.endretAv} ${deltakerEndring.endretAvEnhet}.`}
      </Detail>
    </HistorikkElement>
  )
}
