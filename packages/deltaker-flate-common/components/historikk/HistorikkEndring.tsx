import { BodyLong, BodyShort, Detail, InlineMessage } from '@navikt/ds-react'
import { Tiltakskode } from '../../model/deltaker.ts'
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
import { formatDate, harKursAvslutning } from '../../utils/utils'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { PrisOgBetaling } from '../PrisOgBetaling.tsx'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  deltakerEndring: DeltakerEndring
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
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
    case EndringType.EndreOpplaringKategorisering:
      return EndreDeltakelseType.ENDRE_INNHOLD_OPPLARING_KATEGORISERING
    case EndringType.ReaktiverDeltakelse:
      return EndreDeltakelseType.REAKTIVER_DELTAKELSE
    case EndringType.EndreSluttarsak:
      return EndreDeltakelseType.ENDRE_SLUTTARSAK
    case EndringType.EndreStartdato:
      return EndreDeltakelseType.ENDRE_OPPSTARTSDATO
    case EndringType.FjernOppstartsdato:
      return EndreDeltakelseType.FJERN_OPPSTARTSDATO
    case EndringType.EndreAvslutning:
      return EndreDeltakelseType.ENDRE_AVSLUTNING
    case EndringType.EndrePrisinfo:
      return EndreDeltakelseType.ENDRE_PRISINFO
  }
}

const getEndringsDetaljer = (endring: Endring, tiltakskode: Tiltakskode) => {
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
    case EndringType.EndreAvslutning: {
      return (
        <>
          {endring.sluttdato && (
            <BodyShort size="small">
              Sluttdato: {formatDate(endring.sluttdato)}
            </BodyShort>
          )}
          {endring.aarsak && (
            <BodyLong size="small">
              Årsak: {getDeltakerStatusAarsakText(endring.aarsak)}
            </BodyLong>
          )}

          {endring.harFullfort !== null && (
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
    case EndringType.AvsluttDeltakelse: {
      return (
        <>
          {endring.aarsak && (
            <BodyLong size="small">
              Årsak: {getDeltakerStatusAarsakText(endring.aarsak)}
            </BodyLong>
          )}
          {harKursAvslutning(endring.oppstartstype, tiltakskode) && (
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
          tiltakskode={tiltakskode}
          deltakelsesinnhold={{
            ledetekst: endring.ledetekst || null,
            innhold: endring.innhold
          }}
          heading={null}
        />
      )
    }
    case EndringType.EndreOpplaringKategorisering: {
      return (
        <div className="flex flex-col gap-1">
          <DeltakelseInnhold
            tiltakskode={tiltakskode}
            deltakelsesinnhold={null}
            opplaringKategoriseringValg={endring.opplaringKategoriseringValg}
            heading={null}
          />
          {endring.beskrivelse && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Beskrivelse: {endring.beskrivelse}
            </BodyLong>
          )}
          {endring.pavirkerPris && <PavirkerPris />}
        </div>
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
        <div className="flex flex-col gap-1">
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
          {endring.pavirkerPris && <PavirkerPris />}
        </div>
      )
    case EndringType.ForlengDeltakelse:
      return endring.begrunnelse || endring.pavirkerPris ? (
        <div className="flex flex-col gap-1">
          {endring.begrunnelse && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Navs begrunnelse: {endring.begrunnelse}
            </BodyLong>
          )}
          {endring.pavirkerPris && <PavirkerPris />}
        </div>
      ) : (
        <div className="-mb-1" />
      )
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
        <div className="flex flex-col gap-1">
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
          {endring.pavirkerPris && <PavirkerPris />}
        </div>
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
    case EndringType.EndrePrisinfo: {
      return (
        <>
          <PrisOgBetaling
            prisinformasjon={endring.prisinfo}
            headinglevel="3"
            showHeading={false}
            showTilleggsstonaderInfo={false}
          />
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

export const HistorikkEndring = ({
  deltakerEndring,
  tiltakskode,
  erEnkeltplass
}: Props) => {
  const endreDeltakelsesType = mapEndringsType(deltakerEndring.endring.type)

  return (
    <HistorikkElement
      tittel={getEndringsTittel(deltakerEndring.endring, erEnkeltplass)}
      icon={<EndringTypeIkon type={endreDeltakelsesType} size={'small'} />}
      forslag={deltakerEndring.forslag}
    >
      {getEndringsDetaljer(deltakerEndring.endring, tiltakskode)}
      <Detail className="mt-1" textColor="subtle">
        {`Endret ${formatDate(deltakerEndring.endret)} av ${deltakerEndring.endretAv} ${deltakerEndring.endretAvEnhet}.`}
      </Detail>
    </HistorikkElement>
  )
}

const PavirkerPris = () => (
  <InlineMessage status="warning" size="small">
    Hvis prisen eller betalingsbetingelsene endres, vil du få beskjed om dette.
  </InlineMessage>
)
