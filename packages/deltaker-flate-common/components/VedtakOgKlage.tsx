import { BodyLong, Heading, Link } from '@navikt/ds-react'
import {
  ArenaTiltakskode,
  DeltakerStatusType,
  importertDeltakerFraArena,
  Oppstartstype,
  Vedtaksinformasjon
} from '../model/deltaker'
import { VedtakInfo } from './VedtakInfo'
import { harFellesOppstart } from '../utils/utils'

interface Props {
  statusType: DeltakerStatusType
  tiltakstype: ArenaTiltakskode
  oppstartstype: Oppstartstype
  vedtaksinformasjon: Vedtaksinformasjon | null
  importertFraArena: importertDeltakerFraArena | null
}

export const VedtakOgKlage = ({
  statusType,
  tiltakstype,
  oppstartstype,
  vedtaksinformasjon,
  importertFraArena
}: Props) => {
  const harVedtak =
    statusType !== DeltakerStatusType.SOKT_INN &&
    statusType !== DeltakerStatusType.VENTELISTE &&
    statusType !== DeltakerStatusType.VURDERES &&
    !!vedtaksinformasjon?.fattet

  const harRettTilAKlage = !(
    harFellesOppstart(oppstartstype) &&
    tiltakstype === ArenaTiltakskode.GRUPPEAMO
  )

  return harVedtak ? (
    <>
      <VedtakInfo
        tiltakstype={tiltakstype}
        vedtaksinformasjon={vedtaksinformasjon}
        importertFraArena={importertFraArena}
        className="mt-8"
      />

      {harRettTilAKlage ? (
        <>
          <Heading level="2" size="medium" className="mt-8">
            Du har rett til å klage
          </Heading>
          <BodyLong size="small" className="mt-2">
            Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på
            deltakelsen eller du ønsker et annet arbeidsmarkedstiltak. Fristen
            for å klage er seks uker etter du mottok informasjonen.{' '}
            <Link href="https://www.nav.no/klage">
              Les mer om retten til å klage her.
            </Link>
          </BodyLong>
        </>
      ) : (
        <>
          <Heading level="2" size="medium" className="mt-8">
            Unntak fra klageretten
          </Heading>
          <BodyLong size="small" className="mt-2">
            Etter forvaltningslovforskriften § 33 har du ikke rett til å klage
            på avgjørelsen når du får avslag på å delta på dette
            arbeidsmarkedstiltaket.
          </BodyLong>
        </>
      )}
    </>
  ) : null
}
