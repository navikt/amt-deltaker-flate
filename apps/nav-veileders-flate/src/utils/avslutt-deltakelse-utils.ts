import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  Forslag,
  ForslagEndringType,
  getDateFromString
} from 'deltaker-flate-common'
import { PameldingResponse } from '../api/data/pamelding'

export enum HarDeltattValg {
  JA = 'JA',
  NEI = 'NEI'
}

export enum Avslutningstype {
  FULLFORT = 'FULLFORT',
  AVBRUTT = 'AVBRUTT',
  IKKE_DELTATT = 'IKKE_DELTATT'
}

export const avslutningsBeskrivelseTekstMapper = (
  kategoriType: Avslutningstype
) => {
  switch (kategoriType) {
    case Avslutningstype.FULLFORT:
      return 'Med fullført menes at kurset er gjennomført, og/eller at ønsket mål, sertifisering el. er oppnådd.'
    case Avslutningstype.AVBRUTT:
      return 'Med avbrutt menes at deltakeren avslutter på kurset uten å ha gjennomført og/eller oppnådd ønsket mål, sertifisering el.'
    case Avslutningstype.IKKE_DELTATT:
      return 'Dersom personen ikke har deltatt på tiltaket, vil statusen på tiltaket endres til “Ikke aktuell”.'
    default:
      return 'Ukjent'
  }
}

export function getSluttdato(
  deltaker: PameldingResponse,
  forslag: Forslag | null
) {
  if (forslag === null) {
    return getDateFromString(deltaker.sluttdato)
  }
  if (
    forslag.endring.type === ForslagEndringType.AvsluttDeltakelse ||
    forslag.endring.type === ForslagEndringType.EndreAvslutning ||
    forslag.endring.type === ForslagEndringType.Sluttdato
  ) {
    return forslag.endring.sluttdato
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som sluttdato`
    )
  }
}

export const harDeltattMindreEnn15Dager = (
  pamelding: PameldingResponse,
  forslag: Forslag | null
) => {
  if (getHarDeltatt(forslag) !== null) {
    return true
  }

  const startDato = pamelding.startdato
  if (startDato === null) throw Error('startdato er null')

  const femtenDagerSiden = dayjs().subtract(15, 'days')
  return dayjs(startDato).isAfter(femtenDagerSiden, 'day')
}

export function getHarDeltatt(forslag: Forslag | null): boolean | null {
  if (
    forslag &&
    (forslag.endring.type === ForslagEndringType.AvsluttDeltakelse ||
      forslag.endring.type === ForslagEndringType.EndreAvslutning)
  ) {
    return forslag.endring.harDeltatt ?? null
  }
  return null
}

export function getHarFullfort(
  forslag: Forslag | null
): boolean | null | undefined {
  if (
    forslag &&
    (forslag.endring.type === ForslagEndringType.AvsluttDeltakelse ||
      forslag.endring.type === ForslagEndringType.EndreAvslutning)
  ) {
    return forslag.endring.harFullfort
  }
  return null
}

export const getAvslutningstype = (
  forslag: Forslag | null,
  statusType: DeltakerStatusType,
  harDeltatt: boolean | null,
  erFellesOppstart: boolean
): Avslutningstype | null => {
  const harFullfortValg = getHarFullfort(forslag)
  if (!erFellesOppstart) return null

  if (harFullfortValg === true) return Avslutningstype.FULLFORT
  else if (harDeltatt === false) return Avslutningstype.IKKE_DELTATT
  else if (harFullfortValg === false) return Avslutningstype.AVBRUTT
  else {
    const erAvbrutt = statusType === DeltakerStatusType.AVBRUTT
    const erAvsluttet =
      statusType === DeltakerStatusType.FULLFORT ||
      statusType === DeltakerStatusType.HAR_SLUTTET
    const erIkkeAktuell = statusType === DeltakerStatusType.IKKE_AKTUELL
    return erAvbrutt
      ? Avslutningstype.AVBRUTT
      : erAvsluttet
        ? Avslutningstype.FULLFORT
        : erIkkeAktuell
          ? Avslutningstype.IKKE_DELTATT
          : null
  }
}

export const harStatusSomKanAvslutteDeltakelse = (
  statusType: DeltakerStatusType
) =>
  statusType === DeltakerStatusType.DELTAR ||
  statusType === DeltakerStatusType.HAR_SLUTTET ||
  statusType === DeltakerStatusType.FULLFORT ||
  statusType === DeltakerStatusType.AVBRUTT
