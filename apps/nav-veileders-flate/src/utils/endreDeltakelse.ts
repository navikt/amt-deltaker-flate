import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  EMDASH,
  EndreDeltakelseType,
  harBakgrunnsinfo,
  harInnhold,
  Oppstartstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { PameldingResponse } from '../api/data/pamelding'
import {
  deltakerHarAvsluttendeStatus,
  deltakerHarSluttetEllerFullfort,
  deltakerVenterPaOppstartEllerDeltar
} from './statusutils'
import { dateStrToNullableDate } from './utils'

const ikkeAktuell = (pamelding: PameldingResponse) =>
  pamelding.status.type === DeltakerStatusType.IKKE_AKTUELL

const harSluttetEllerFullfort = (pamelding: PameldingResponse) =>
  deltakerHarSluttetEllerFullfort(pamelding.status.type)

const venterDeltarEllerAvsluttet = (pamelding: PameldingResponse) =>
  deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) ||
  deltakerHarAvsluttendeStatus(pamelding.status.type)

const skalViseForlengKnapp = (
  pamelding: PameldingResponse,
  sluttdato: Date | null
) =>
  sluttdato &&
  (pamelding.status.type === DeltakerStatusType.DELTAR ||
    harSluttetEllerFullfort(pamelding))

const skalViseEndreInnholdKnapp = (pamelding: PameldingResponse) =>
  harInnhold(pamelding.deltakerliste.tiltakskode)

const skalViseEndreBakgrunnsinfoKnapp = (pamelding: PameldingResponse) =>
  venterDeltarEllerAvsluttet(pamelding) &&
  harBakgrunnsinfo(pamelding.deltakerliste.tiltakskode)

const skalViseEndreSluttarsakKnapp = (pamelding: PameldingResponse) =>
  pamelding.status.type === DeltakerStatusType.IKKE_AKTUELL

const skalViseEndreDeltakelsesmengde = (pamelding: PameldingResponse) =>
  (pamelding.deltakerliste.tiltakskode ===
    Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    pamelding.deltakerliste.tiltakskode ===
      Tiltakskode.ARBEIDSFORBEREDENDE_TRENING) &&
  venterDeltarEllerAvsluttet(pamelding)

export const kanEndreOppstartsdato = (pamelding: PameldingResponse) =>
  (deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) &&
    pamelding.startdato &&
    pamelding.startdato !== EMDASH) ||
  harSluttetEllerFullfort(pamelding) ||
  kanLeggeTilOppstartsdato(pamelding)

const skalViseFjernOppstartsdato = (pamelding: PameldingResponse) =>
  // TODO bruke pameldingstype?
  pamelding.deltakerliste.oppstartstype === Oppstartstype.LOPENDE &&
  pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART &&
  pamelding.startdato &&
  pamelding.startdato !== EMDASH

const skalViseEndreAvslutning = (pamelding: PameldingResponse) =>
  deltakerHarSluttetEllerFullfort(pamelding.status.type)

const erDeltakelseLaast = (pamelding: PameldingResponse): boolean => {
  if (!pamelding.kanEndres) {
    return true
  }

  if (!deltakerHarAvsluttendeStatus(pamelding.status.type)) {
    return false
  }

  const sluttdato = dateStrToNullableDate(pamelding.sluttdato)
  const statusGyldigFra = pamelding.status.gyldigFra
  const nyesteDato = getNyesteDato([sluttdato, statusGyldigFra])

  if (!nyesteDato) {
    return false
  }

  const toMndSiden = new Date()
  toMndSiden.setMonth(toMndSiden.getMonth() - 2)

  return dayjs(nyesteDato).isBefore(toMndSiden)
}

const getNyesteDato = (datoer: (Date | null)[]) => {
  const gyldigeDatoer = datoer.filter((date): date is Date => date !== null)

  if (gyldigeDatoer.length === 0) {
    return null
  }

  return gyldigeDatoer.reduce((latest, current) =>
    current > latest ? current : latest
  )
}

export const getEndreDeltakelsesValg = (pamelding: PameldingResponse) => {
  const valg: EndreDeltakelseType[] = []
  const sluttdato = dateStrToNullableDate(pamelding.sluttdato)
  const deltakelseErLaast = erDeltakelseLaast(pamelding)

  if (kanEndreOppstartsdato(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_OPPSTARTSDATO)
  }
  if (
    [
      DeltakerStatusType.VENTER_PA_OPPSTART,
      DeltakerStatusType.SOKT_INN,
      DeltakerStatusType.VURDERES,
      DeltakerStatusType.VENTELISTE
    ].includes(pamelding.status.type)
  ) {
    valg.push(EndreDeltakelseType.IKKE_AKTUELL)
  }
  if (skalViseForlengKnapp(pamelding, sluttdato) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.FORLENG_DELTAKELSE)
  }
  if (skalViseEndreInnholdKnapp(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_INNHOLD)
  }
  if (skalViseEndreBakgrunnsinfoKnapp(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_BAKGRUNNSINFO)
  }
  if (pamelding.status.type === DeltakerStatusType.DELTAR) {
    valg.push(EndreDeltakelseType.AVSLUTT_DELTAKELSE)
  }
  if (skalViseEndreDeltakelsesmengde(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE)
  }
  if (skalViseFjernOppstartsdato(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.FJERN_OPPSTARTSDATO)
  }
  if (skalViseEndreSluttarsakKnapp(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_SLUTTARSAK)
  }
  if (skalViseEndreAvslutning(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_AVSLUTNING)
  }
  if (ikkeAktuell(pamelding) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.REAKTIVER_DELTAKELSE)
  }

  return valg
}

export const validerDeltakerKanEndres = (deltaker: PameldingResponse) => {
  if (deltaker.status.type === DeltakerStatusType.FEILREGISTRERT) {
    throw new Error(
      'Deltakeren er feilregistrert, og kan derfor ikke redigeres.'
    )
  }
  if (erDeltakelseLaast(deltaker)) {
    throw new Error(
      'Deltaker fikk avsluttende status for mer enn to måneder siden eller det finnes en nyere deltakelse, og kan derfor ikke redigeres.'
    )
  }
}

export const kanLeggeTilOppstartsdato = (pamelding: PameldingResponse) => {
  // Noen arrangører bruker ikke deltakerlisten,
  // derfor må Nav-veileder kunne legge til / endre oppstartsdato
  return (
    (pamelding.startdato === null || pamelding.startdato === EMDASH) &&
    pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART &&
    [
      Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING,
      Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING
    ].includes(pamelding.deltakerliste.tiltakskode)
  )
}
