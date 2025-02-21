import { BodyLong, List } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  getDateFromString,
  isValidDate,
  ArenaTiltakskode
} from 'deltaker-flate-common'
import { PameldingResponse } from '../api/data/pamelding'
import { dateStrToNullableDate } from './utils'

export enum VarighetValg {
  ANNET = 'ANNET',
  FIRE_UKER = 'FIRE_UKER',
  SEKS_UKER = 'SEKS_UKER',
  ATTE_UKER = 'ATTE_UKER',
  TOLV_UKER = 'TOLV_UKER',
  TRE_MANEDER = 'TRE_MANEDER',
  FIRE_MANEDER = 'FIRE_MANEDER',
  SEKS_MANEDER = 'SEKS_MANEDER',
  ATTE_MANEDER = 'ATTE_MANEDER',
  TOLV_MANEDER = 'TOLV_MANEDER'
}

export interface Varighet {
  antall: number
  tidsenhet: 'day' | 'week' | 'month' | 'year'
  navn: string
}

type Varigheter = {
  [valg: string]: Varighet
}

const varigheter: Varigheter = {
  [VarighetValg.FIRE_UKER]: { antall: 4, tidsenhet: 'week', navn: '4 uker' },
  [VarighetValg.SEKS_UKER]: { antall: 6, tidsenhet: 'week', navn: '6 uker' },
  [VarighetValg.ATTE_UKER]: { antall: 8, tidsenhet: 'week', navn: '8 uker' },
  [VarighetValg.TOLV_UKER]: { antall: 12, tidsenhet: 'week', navn: '12 uker' },
  [VarighetValg.TRE_MANEDER]: {
    antall: 3,
    tidsenhet: 'month',
    navn: '3 måneder'
  },
  [VarighetValg.FIRE_MANEDER]: {
    antall: 4,
    tidsenhet: 'month',
    navn: '4 måneder'
  },
  [VarighetValg.SEKS_MANEDER]: {
    antall: 6,
    tidsenhet: 'month',
    navn: '6 måneder'
  },
  [VarighetValg.ATTE_MANEDER]: {
    antall: 8,
    tidsenhet: 'month',
    navn: '8 måneder'
  },
  [VarighetValg.TOLV_MANEDER]: {
    antall: 12,
    tidsenhet: 'month',
    navn: '12 måneder'
  }
}

export const getVarighet = (valg: VarighetValg): Varighet => {
  return varigheter[valg]
}

export const varighetValgForType = (
  tiltakstype: ArenaTiltakskode
): VarighetValg[] => {
  switch (tiltakstype) {
    case ArenaTiltakskode.ARBFORB:
      return [
        VarighetValg.TRE_MANEDER,
        VarighetValg.SEKS_MANEDER,
        VarighetValg.TOLV_MANEDER
      ]
    case ArenaTiltakskode.ARBRRHDAG:
      return [
        VarighetValg.FIRE_UKER,
        VarighetValg.ATTE_UKER,
        VarighetValg.TOLV_UKER
      ]
    case ArenaTiltakskode.AVKLARAG:
      return [VarighetValg.FIRE_UKER, VarighetValg.ATTE_UKER]
    case ArenaTiltakskode.INDOPPFAG:
      return [VarighetValg.TRE_MANEDER, VarighetValg.SEKS_MANEDER]
    case ArenaTiltakskode.DIGIOPPARB:
      return [VarighetValg.FIRE_UKER]
    case ArenaTiltakskode.VASV:
      return []
    case ArenaTiltakskode.GRUFAGYRKE:
    default:
      return [
        VarighetValg.FIRE_UKER,
        VarighetValg.SEKS_UKER,
        VarighetValg.ATTE_UKER,
        VarighetValg.TOLV_UKER,
        VarighetValg.TRE_MANEDER
      ]
  }
}

export function finnVarighetValg(
  fraDato: Date,
  tilDato: Date
): { uker: VarighetValg; maaneder: VarighetValg } {
  const fra = dayjs(fraDato)
  const til = dayjs(tilDato)

  const uker = til.diff(fra, 'weeks')
  const maaneder = til.diff(fra, 'months')

  const ukeVarighet = () => {
    if (fra.add(uker, 'weeks').isBefore(til)) {
      return VarighetValg.ANNET
    }

    switch (uker) {
      case 4:
        return VarighetValg.FIRE_UKER
      case 6:
        return VarighetValg.SEKS_UKER
      case 8:
        return VarighetValg.ATTE_UKER
      case 12:
        return VarighetValg.TOLV_UKER
      default:
        return VarighetValg.ANNET
    }
  }

  const mndVarighet = () => {
    if (fra.add(maaneder, 'months').isBefore(til)) {
      return VarighetValg.ANNET
    }

    switch (maaneder) {
      case 3:
        return VarighetValg.TRE_MANEDER
      case 4:
        return VarighetValg.FIRE_MANEDER
      case 6:
        return VarighetValg.SEKS_MANEDER
      case 8:
        return VarighetValg.ATTE_MANEDER
      case 12:
        return VarighetValg.TOLV_MANEDER
      default:
        return VarighetValg.ANNET
    }
  }

  return {
    uker: ukeVarighet(),
    maaneder: mndVarighet()
  }
}

export function finnValgtVarighet(
  fraDato: Date | null | undefined,
  tilDato: Date | null | undefined,
  tiltakstype: ArenaTiltakskode
) {
  return fraDato && tilDato
    ? finnVarighetValgForTiltakstype(fraDato, tilDato, tiltakstype)
    : undefined
}

export function finnVarighetValgForTiltakstype(
  fraDato: Date,
  tilDato: Date,
  tiltakstype: ArenaTiltakskode
) {
  const varigheter = varighetValgForType(tiltakstype)

  if (varigheter.length == 0) return undefined

  const varighet = finnVarighetValg(fraDato, tilDato)

  if (varigheter.includes(varighet.uker)) {
    return varighet.uker
  } else if (varigheter.includes(varighet.maaneder)) {
    return varighet.maaneder
  } else {
    return VarighetValg.ANNET
  }
}

export const kalkulerSluttdato = (
  sluttdato: Date,
  varighet: Varighet
): Date => {
  return dayjs(sluttdato).add(varighet.antall, varighet.tidsenhet).toDate()
}

/**
 * Returnerer datoen regnet ut av max varighet fra nyStartdato eller deltakerens startdato
 * @param pamelding
 * @param nyStartdato varighet regnes ut fra denne hvis gitt, ellers brukes deltakerens startdato
 */
export const getMaxVarighetDato = (
  pamelding: PameldingResponse,
  nyStartdato?: Date
) => {
  if (!pamelding.maxVarighet) {
    return null
  } else if (nyStartdato) {
    return dayjs(nyStartdato).add(pamelding.maxVarighet, 'millisecond')
  } else {
    return isValidDate(pamelding.startdato)
      ? dayjs(pamelding.startdato).add(pamelding.maxVarighet, 'millisecond')
      : null
  }
}

export const getSoftMaxVarighetBekreftelseText = (
  tiltakstype: ArenaTiltakskode
) => {
  if (tiltakstype === ArenaTiltakskode.INDOPPFAG) {
    return (
      <BodyLong>
        Sluttdatoen er utenfor hovedregelen for maks varighet.<br></br>
        <br></br>
        Som hovedregel kan varigheten være maks tre år for brukere med nedsatt
        arbeidsevne. Hvis tiltaket brukes ved overgang fra skole eller soning i
        institusjon kan varigheten forlenges med ytterligere seks måneder.{' '}
        <br></br>
        <br></br>
        Brukes tiltaket ved overgang fra skole eller soning i institusjon?
      </BodyLong>
    )
  }
  if (tiltakstype === ArenaTiltakskode.ARBFORB) {
    return (
      <BodyLong>
        Sluttdatoen er utenfor hovedregelen for maks varighet. <br></br>
        <br></br>
        Som hovedregel kan varigheten være maks to år. Hvis deltakeren
        gjennomfører opplæring med sikte på formell kompetanse, kan varigheten
        forlenges med ytterligere ett år.<br></br>
        <br></br>
        Gjennomfører personen opplæring med sikte på formell kompetanse?
      </BodyLong>
    )
  }
  if (
    tiltakstype === ArenaTiltakskode.ARBRRHDAG ||
    tiltakstype === ArenaTiltakskode.AVKLARAG ||
    tiltakstype === ArenaTiltakskode.DIGIOPPARB
  ) {
    return (
      <BodyLong size="small">
        Ny sluttdato er utenfor hovedregelen for maks varighet. Denne godkjennes
        kun dersom minst ett av følgende krav er oppfylt:
        <br></br>
        <List as="ul" size="small">
          <List.Item>
            Deltakeren har rett på lovbestemt ferie, og skal stå innmeldt på
            tiltaket i ferieperioden.
          </List.Item>
          <List.Item>
            Arrangøren har stengt, og deltakeren skal stå innmeldt på tiltaket i
            stengeperioden.
          </List.Item>
        </List>
      </BodyLong>
    )
  }
  return null
}

export const DATO_UTENFOR_TILTAKGJENNOMFORING =
  'Datoen kan ikke velges fordi den er utenfor perioden til tiltaket.'
export const VARIGHET_VALG_FØR_FEILMELDING =
  'Datoen kan ikke velges fordi den er før startdato.'
export const VARIGHET_VALG_ETTER_DELTAKERLISTE_SLUTTDATO_FEILMELDING =
  'Datoen kan ikke velges fordi den er etter gjennomføringens sluttdato.'
export const VARGIHET_VALG_FEILMELDING =
  'Datoen kan ikke velges fordi den er utenfor maks varighet.'
export const SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING =
  'Datoen kan ikke velges fordi den er før oppstartsdatoen.'
export const VARIGHET_BEKREFTELSE_FEILMELDING =
  'Du må bekrefte at deltakeren oppfyller kravene.'
export const UGYLDIG_DATO_FEILMELDING = 'Ugyldig dato'
export const DATO_FØR_SLUTTDATO_FEILMELDING =
  'Datoen kan ikke velges fordi den er før nåværende sluttdato.'
/**
 * Returnerer datoen som kommer først av deltakerlistens sluttdato
 * eller max varighet regnet ut fra 'nyStartdato' eller hvis den ikke er gitt; deltakerens startdato
 * @param pamelding
 * @param nyStartdato varighet regnes ut fra denne hvis gitt, ellers brukes deltakerens startdato
 */
export const getSisteGyldigeSluttDato = (
  pamelding: PameldingResponse,
  nyStartdato?: Date
) => {
  const deltakerlisteSluttDato = dateStrToNullableDate(
    pamelding.deltakerliste.sluttdato
  )

  const maxVarighetDato = getMaxVarighetDato(pamelding, nyStartdato)

  if (!deltakerlisteSluttDato) {
    return maxVarighetDato?.toDate()
  } else if (!maxVarighetDato) {
    return deltakerlisteSluttDato
  } else if (dayjs(deltakerlisteSluttDato).isAfter(maxVarighetDato, 'date')) {
    if (maxVarighetDato.isBefore(pamelding.sluttdato)) {
      return dayjs(pamelding.sluttdato).toDate()
    }
    return maxVarighetDato.toDate()
  } else {
    return deltakerlisteSluttDato
  }
}

export const getSkalBekrefteVarighet = (
  pamelding: PameldingResponse,
  nySluttDato?: Date | null,
  nyStartdato?: Date | null
) => {
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const startdato = nyStartdato || getDateFromString(pamelding.startdato)
  const softMaxVarighetDato =
    startdato && pamelding.softMaxVarighet
      ? dayjs(startdato).add(pamelding.softMaxVarighet, 'millisecond')
      : null
  const maxVarighetDato = getSisteGyldigeSluttDato(pamelding, startdato)
  const tiltakstyperMedSoftMaxVarighet = [
    ArenaTiltakskode.ARBFORB,
    ArenaTiltakskode.INDOPPFAG,
    ArenaTiltakskode.ARBRRHDAG,
    ArenaTiltakskode.AVKLARAG,
    ArenaTiltakskode.DIGIOPPARB
  ]

  if (
    tiltakstyperMedSoftMaxVarighet.includes(tiltakstype) &&
    nySluttDato &&
    softMaxVarighetDato
  ) {
    const erSluttDatoEtterSoftMaxDato = dayjs(nySluttDato).isAfter(
      softMaxVarighetDato,
      'date'
    )
    const erSluttDatoForMaxDato = maxVarighetDato
      ? dayjs(nySluttDato).isSameOrBefore(maxVarighetDato, 'date')
      : true

    return erSluttDatoEtterSoftMaxDato && erSluttDatoForMaxDato
  } else return false
}

export const getSluttDatoFeilmelding = (
  pamelding: PameldingResponse,
  nySluttDato: Date,
  nyStartdato?: Date,
  erForleng?: boolean
) => {
  const deltakerstartDato = getDateFromString(pamelding.startdato)
  const deltakerlisteSluttDato = dateStrToNullableDate(
    pamelding.deltakerliste.sluttdato
  )
  const maxVarighetDato = getMaxVarighetDato(pamelding, nyStartdato)
  const sluttDato = dayjs(nySluttDato)

  if (
    (nyStartdato && sluttDato.isBefore(nyStartdato, 'date')) ||
    (!nyStartdato &&
      deltakerstartDato &&
      sluttDato.isBefore(deltakerstartDato, 'date'))
  ) {
    return SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING
  }

  const opprinneligSluttdato = getDateFromString(pamelding.sluttdato)
  if (
    erForleng &&
    opprinneligSluttdato &&
    sluttDato.isBefore(opprinneligSluttdato)
  ) {
    return DATO_FØR_SLUTTDATO_FEILMELDING
  }

  if (!maxVarighetDato && !deltakerlisteSluttDato) {
    return null
  }

  if (!maxVarighetDato && sluttDato.isAfter(deltakerlisteSluttDato, 'date')) {
    return DATO_UTENFOR_TILTAKGJENNOMFORING
  }

  if (!deltakerlisteSluttDato && sluttDato.isAfter(maxVarighetDato, 'date')) {
    if (
      maxVarighetDato?.isBefore(pamelding.sluttdato, 'date') &&
      sluttDato.isSameOrBefore(pamelding.sluttdato, 'date')
    ) {
      return null
    }
    return VARGIHET_VALG_FEILMELDING
  }

  if (
    (sluttDato.isSameOrBefore(deltakerlisteSluttDato, 'date') &&
      sluttDato.isSameOrBefore(maxVarighetDato, 'date')) ||
    (!maxVarighetDato &&
      sluttDato.isSameOrBefore(deltakerlisteSluttDato, 'date')) ||
    (!deltakerlisteSluttDato &&
      sluttDato.isSameOrBefore(maxVarighetDato, 'date')) ||
    (maxVarighetDato?.isBefore(pamelding.sluttdato, 'date') &&
      sluttDato.isSameOrBefore(pamelding.sluttdato, 'date'))
  ) {
    return null
  }

  if (dayjs(maxVarighetDato).isBefore(deltakerlisteSluttDato, 'date')) {
    return sluttDato.isAfter(deltakerlisteSluttDato)
      ? DATO_UTENFOR_TILTAKGJENNOMFORING
      : VARGIHET_VALG_FEILMELDING
  } else {
    return DATO_UTENFOR_TILTAKGJENNOMFORING
  }
}
