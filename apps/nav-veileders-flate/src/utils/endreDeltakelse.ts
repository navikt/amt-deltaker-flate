import {
  DeltakerStatusType,
  EndreDeltakelseType,
  Tiltakstype
} from 'deltaker-flate-common'
import { PameldingResponse } from '../api/data/pamelding'
import {
  deltakerHarAvsluttendeStatus,
  deltakerHarSluttetEllerFullfort,
  deltakerVenterPaOppstartEllerDeltar
} from './statusutils'
import { dateStrToNullableDate } from './utils'
import dayjs from 'dayjs'

const harSluttetKanEndres = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  pamelding.status.type === DeltakerStatusType.HAR_SLUTTET &&
  statusdato > toMndSiden &&
  pamelding.kanEndres

const ikkeAktuellKanEndres = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  pamelding.status.type === DeltakerStatusType.IKKE_AKTUELL &&
  statusdato > toMndSiden &&
  pamelding.kanEndres

const harSluttetEllerFullfortKanEndres = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  deltakerHarSluttetEllerFullfort(pamelding.status.type) &&
  statusdato > toMndSiden &&
  pamelding.kanEndres

const harAvsluttendeStatusKanEndres = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  deltakerHarAvsluttendeStatus(pamelding.status.type) &&
  statusdato > toMndSiden &&
  pamelding.kanEndres

const venterDeltarEllerKanEndres = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) ||
  harAvsluttendeStatusKanEndres(pamelding, statusdato, toMndSiden)

const skalViseForlengKnapp = (
  pamelding: PameldingResponse,
  sluttdato: Date | null,
  statusdato: Date,
  toMndSiden: Date
) =>
  sluttdato &&
  (pamelding.status.type === DeltakerStatusType.DELTAR ||
    harSluttetKanEndres(pamelding, statusdato, toMndSiden))

const skalViseEndreInnholdKnapp = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  venterDeltarEllerKanEndres(pamelding, statusdato, toMndSiden) &&
  pamelding.deltakerliste.tiltakstype !== Tiltakstype.DIGIOPPARB

const skalViseEndreBakgrunnsinfoKnapp = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  venterDeltarEllerKanEndres(pamelding, statusdato, toMndSiden) &&
  pamelding.deltakerliste.tiltakstype !== Tiltakstype.DIGIOPPARB

const skalViseEndreSluttdatoKnapp = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  deltakerHarSluttetEllerFullfort(pamelding.status.type) &&
  harSluttetKanEndres(pamelding, statusdato, toMndSiden)

const skalViseEndreSluttarsakKnapp = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  harSluttetKanEndres(pamelding, statusdato, toMndSiden) ||
  ikkeAktuellKanEndres(pamelding, statusdato, toMndSiden)

const skalViseEndreDeltakelsesmengde = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  (pamelding.deltakerliste.tiltakstype === Tiltakstype.VASV ||
    pamelding.deltakerliste.tiltakstype === Tiltakstype.ARBFORB) &&
  venterDeltarEllerKanEndres(pamelding, statusdato, toMndSiden)

const skalViseEndreOppstartsdato = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  (deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) &&
    pamelding.startdato) ||
  harSluttetEllerFullfortKanEndres(pamelding, statusdato, toMndSiden)

export const getEndreDeltakelsesValg = (pamelding: PameldingResponse) => {
  const valg: EndreDeltakelseType[] = []
  const sluttdato = dateStrToNullableDate(pamelding.sluttdato)
  const statusdato = pamelding.status.gyldigFra
  const toMndSiden = new Date()
  toMndSiden.setMonth(toMndSiden.getMonth() - 2)

  if (skalViseEndreOppstartsdato(pamelding, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.ENDRE_OPPSTARTSDATO)
  }
  if (pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART) {
    valg.push(EndreDeltakelseType.IKKE_AKTUELL)
  }
  if (ikkeAktuellKanEndres(pamelding, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.REAKTIVER_DELTAKELSE)
  }
  if (skalViseForlengKnapp(pamelding, sluttdato, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.FORLENG_DELTAKELSE)
  }
  if (skalViseEndreInnholdKnapp(pamelding, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.ENDRE_INNHOLD)
  }
  if (skalViseEndreBakgrunnsinfoKnapp(pamelding, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.ENDRE_BAKGRUNNSINFO)
  }
  if (pamelding.status.type === DeltakerStatusType.DELTAR) {
    valg.push(EndreDeltakelseType.AVSLUTT_DELTAKELSE)
  }
  if (skalViseEndreSluttdatoKnapp(pamelding, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.ENDRE_SLUTTDATO)
  }
  if (skalViseEndreSluttarsakKnapp(pamelding, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.ENDRE_SLUTTARSAK)
  }
  if (skalViseEndreDeltakelsesmengde(pamelding, statusdato, toMndSiden)) {
    valg.push(EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE)
  }

  return valg
}

export const validerDeltakerKanEndres = (deltaker: PameldingResponse) => {
  if (deltaker.status.type === DeltakerStatusType.FEILREGISTRERT) {
    throw new Error(
      'Deltakeren er feilregistrert, og kan derfor ikke redigeres.'
    )
  }
  if (deltakerHarAvsluttendeStatus(deltaker.status.type)) {
    if (!deltaker.kanEndres) {
      throw new Error(
        'Det finnes en annen aktiv deltakelse på samme tiltak. Denne deltakelsen kan ikke endres.'
      )
    }
    const toMndSiden = dayjs().subtract(2, 'months')
    if (dayjs(deltaker.status.gyldigFra).isSameOrBefore(toMndSiden)) {
      throw new Error(
        'Deltaker fikk avsluttende status for mer enn to måneder siden, og kan derfor ikke redigeres.'
      )
    }
  }
}
