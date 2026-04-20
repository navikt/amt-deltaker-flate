import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  EndreDeltakelseType,
  harBakgrunnsinfo,
  harInnhold,
  harLopendeOppstart,
  Tiltakskode
} from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import {
  deltakerHarAvsluttendeStatus,
  deltakerHarSluttetEllerFullfort,
  deltakerVenterPaOppstartEllerDeltar
} from './statusutils'

const ikkeAktuell = (pamelding: DeltakerResponse) =>
  pamelding.status.type === DeltakerStatusType.IKKE_AKTUELL

const harSluttetEllerFullfort = (pamelding: DeltakerResponse) =>
  deltakerHarSluttetEllerFullfort(pamelding.status.type)

const venterDeltarEllerAvsluttet = (pamelding: DeltakerResponse) =>
  deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) ||
  deltakerHarAvsluttendeStatus(pamelding.status.type)

const skalViseForlengKnapp = (
  pamelding: DeltakerResponse,
  sluttdato: Date | null
) =>
  sluttdato &&
  (pamelding.status.type === DeltakerStatusType.DELTAR ||
    harSluttetEllerFullfort(pamelding))

const skalViseEndreInnholdKnapp = (pamelding: DeltakerResponse) =>
  harInnhold(pamelding.deltakerliste.tiltakskode)

const skalViseEndreBakgrunnsinfoKnapp = (pamelding: DeltakerResponse) =>
  venterDeltarEllerAvsluttet(pamelding) &&
  harBakgrunnsinfo(pamelding.deltakerliste.tiltakskode)

const skalViseEndreSluttarsakKnapp = (pamelding: DeltakerResponse) =>
  pamelding.status.type === DeltakerStatusType.IKKE_AKTUELL

const skalViseEndreDeltakelsesmengde = (pamelding: DeltakerResponse) =>
  (pamelding.deltakerliste.tiltakskode ===
    Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    pamelding.deltakerliste.tiltakskode ===
      Tiltakskode.ARBEIDSFORBEREDENDE_TRENING ||
    pamelding.deltakerliste.tiltakskode === Tiltakskode.TILPASSET_JOBBSTOTTE) &&
  venterDeltarEllerAvsluttet(pamelding)

export const kanEndreOppstartsdato = (pamelding: DeltakerResponse) =>
  deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) ||
  harSluttetEllerFullfort(pamelding)

const skalViseFjernOppstartsdato = (pamelding: DeltakerResponse) =>
  harLopendeOppstart(pamelding.deltakerliste.oppstartstype) &&
  pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART &&
  pamelding.startdato

const skalViseEndreAvslutning = (pamelding: DeltakerResponse) =>
  deltakerHarSluttetEllerFullfort(pamelding.status.type)

const erDeltakelseLaast = (pamelding: DeltakerResponse): boolean => {
  if (!pamelding.kanEndres) {
    return true
  }

  if (!deltakerHarAvsluttendeStatus(pamelding.status.type)) {
    return false
  }

  const sluttdato = pamelding.sluttdato
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

export const getEndreDeltakelsesValg = (pamelding: DeltakerResponse) => {
  const valg: EndreDeltakelseType[] = []
  const sluttdato = pamelding.sluttdato
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

export const validerDeltakerKanEndres = (deltaker: DeltakerResponse) => {
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
