import dayjs from 'dayjs'
import {
  DeltakerlisteStatus,
  DeltakerStatusType,
  EndreDeltakelseType,
  harBakgrunnsinfo,
  harDeltakelsesmengde,
  harInnhold,
  harLopendeOppstart
} from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import {
  deltakerHarAvsluttendeStatus,
  deltakerHarSluttetEllerFullfort,
  deltakerVenterPaOppstartEllerDeltar,
  erEnkeltplassSoktInn
} from './statusutils'

const ikkeAktuell = (deltaker: DeltakerResponse) =>
  deltaker.status.type === DeltakerStatusType.IKKE_AKTUELL

const harSluttetEllerFullfort = (deltaker: DeltakerResponse) =>
  deltakerHarSluttetEllerFullfort(deltaker.status.type)

const venterDeltarEllerAvsluttet = (deltaker: DeltakerResponse) =>
  deltakerVenterPaOppstartEllerDeltar(deltaker.status.type) ||
  deltakerHarAvsluttendeStatus(deltaker.status.type)

const skalViseForlengKnapp = (
  deltaker: DeltakerResponse,
  sluttdato: Date | null
) =>
  sluttdato &&
  (deltaker.status.type === DeltakerStatusType.DELTAR ||
    harSluttetEllerFullfort(deltaker))

const skalViseEndreInnholdKnapp = (deltaker: DeltakerResponse) =>
  harInnhold(deltaker.deltakerliste.tiltakskode)

const skalViseEndreBakgrunnsinfoKnapp = (deltaker: DeltakerResponse) =>
  venterDeltarEllerAvsluttet(deltaker) &&
  harBakgrunnsinfo(deltaker.deltakerliste.tiltakskode)

const skalViseEndreSluttarsakKnapp = (deltaker: DeltakerResponse) =>
  deltaker.status.type === DeltakerStatusType.IKKE_AKTUELL

const skalViseEndreDeltakelsesmengde = (deltaker: DeltakerResponse) =>
  harDeltakelsesmengde(
    deltaker.deltakerliste.tiltakskode,
    deltaker.deltakerliste.erEnkeltplass
  ) &&
  (venterDeltarEllerAvsluttet(deltaker) || erEnkeltplassSoktInn(deltaker))

const skalViseEndrePrisOgBetaling = (deltaker: DeltakerResponse) =>
  deltaker.deltakerliste.erEnkeltplass &&
  deltaker.status.type in
    [
      DeltakerStatusType.SOKT_INN,
      DeltakerStatusType.VENTER_PA_OPPSTART,
      DeltakerStatusType.DELTAR,
      DeltakerStatusType.FULLFORT,
      DeltakerStatusType.AVBRUTT,
      DeltakerStatusType.IKKE_AKTUELL
    ]

export const kanEndreOppstartsdato = (deltaker: DeltakerResponse) =>
  deltakerVenterPaOppstartEllerDeltar(deltaker.status.type) ||
  harSluttetEllerFullfort(deltaker) ||
  erEnkeltplassSoktInn(deltaker)

const skalViseFjernOppstartsdato = (deltaker: DeltakerResponse) =>
  harLopendeOppstart(deltaker.deltakerliste.oppstartstype) &&
  deltaker.status.type === DeltakerStatusType.VENTER_PA_OPPSTART &&
  deltaker.startdato

const skalViseEndreAvslutning = (deltaker: DeltakerResponse) =>
  deltakerHarSluttetEllerFullfort(deltaker.status.type)

const STATUSER_SOM_TILLATER_BEGRENSET_REDIGERING = [
  DeltakerStatusType.HAR_SLUTTET,
  DeltakerStatusType.FULLFORT,
  DeltakerStatusType.AVBRUTT
]

/**
 * Returnerer true dersom deltakelsen er låst (kanEndres=false) men ble avsluttet
 * for under to måneder siden. I dette tilfellet er det tillatt å endre avslutning
 * (ENDRE_AVSLUTNING) til en annen avsluttende status.
 */
export const erLaastMenNyligAvsluttet = (
  deltaker: DeltakerResponse
): boolean => {
  if (deltaker.kanEndres) return false

  if (
    !STATUSER_SOM_TILLATER_BEGRENSET_REDIGERING.includes(deltaker.status.type)
  ) {
    return false
  }

  const sluttdato = deltaker.sluttdato
  const statusGyldigFra = deltaker.status.gyldigFra
  const nyesteDato = getNyesteDato([sluttdato, statusGyldigFra])

  if (!nyesteDato) return false

  const toMndSiden = new Date()
  toMndSiden.setMonth(toMndSiden.getMonth() - 2)

  return !dayjs(nyesteDato).isBefore(toMndSiden)
}

const erDeltakelseLaast = (
  deltaker: DeltakerResponse,
  laastMenNyligAvsluttet = erLaastMenNyligAvsluttet(deltaker)
): boolean => {
  // Låst men nylig avsluttet – begrenset redigering er tillatt
  if (laastMenNyligAvsluttet) {
    return false
  }

  if (!deltaker.kanEndres) {
    return true
  }

  if (!deltakerHarAvsluttendeStatus(deltaker.status.type)) {
    return false
  }

  const sluttdato = deltaker.sluttdato
  const statusGyldigFra = deltaker.status.gyldigFra
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

export const getEndreDeltakelsesValg = (deltaker: DeltakerResponse) => {
  const valg: EndreDeltakelseType[] = []
  const sluttdato = deltaker.sluttdato
  const deltakelseErLaastMenNyligAvsluttet = erLaastMenNyligAvsluttet(deltaker)
  const deltakelseErLaast = erDeltakelseLaast(
    deltaker,
    deltakelseErLaastMenNyligAvsluttet
  )

  // Låst men nylig avsluttet – kun ENDRE_AVSLUTNING er tillatt
  if (deltakelseErLaastMenNyligAvsluttet) {
    if (skalViseEndreAvslutning(deltaker)) {
      valg.push(EndreDeltakelseType.ENDRE_AVSLUTNING)
    }
    return valg
  }

  if (kanEndreOppstartsdato(deltaker) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_OPPSTARTSDATO)
  }
  if (
    [
      DeltakerStatusType.VENTER_PA_OPPSTART,
      DeltakerStatusType.SOKT_INN,
      DeltakerStatusType.VURDERES,
      DeltakerStatusType.VENTELISTE
    ].includes(deltaker.status.type)
  ) {
    valg.push(EndreDeltakelseType.IKKE_AKTUELL)
  }
  if (skalViseForlengKnapp(deltaker, sluttdato) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.FORLENG_DELTAKELSE)
  }
  if (skalViseEndreInnholdKnapp(deltaker) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_INNHOLD)
  }
  if (skalViseEndreBakgrunnsinfoKnapp(deltaker) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_BAKGRUNNSINFO)
  }
  if (deltaker.status.type === DeltakerStatusType.DELTAR) {
    valg.push(EndreDeltakelseType.AVSLUTT_DELTAKELSE)
  }
  if (skalViseEndreDeltakelsesmengde(deltaker) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE)
  }
  if (skalViseEndrePrisOgBetaling(deltaker) && !deltakelseErLaast) {
    // TODO valg.push(....ENDRE_PRIS_OG_BETALING)
  }
  if (skalViseFjernOppstartsdato(deltaker) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.FJERN_OPPSTARTSDATO)
  }
  if (skalViseEndreSluttarsakKnapp(deltaker) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_SLUTTARSAK)
  }
  if (skalViseEndreAvslutning(deltaker) && !deltakelseErLaast) {
    valg.push(EndreDeltakelseType.ENDRE_AVSLUTNING)
  }
  if (
    ikkeAktuell(deltaker) &&
    !deltakelseErLaast &&
    (deltaker.deltakerliste.status === DeltakerlisteStatus.GJENNOMFORES ||
      deltaker.deltakerliste.erEnkeltplass)
  ) {
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
      'Deltaker fikk avsluttende status for mer enn to måneder siden eller det finnes en nyere aktiv deltakelse, og kan derfor ikke redigeres.'
    )
  }
}
