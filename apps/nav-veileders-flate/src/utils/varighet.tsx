import { BodyLong } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Tiltakstype } from 'deltaker-flate-common'
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
  tiltakstype: Tiltakstype
): VarighetValg[] => {
  switch (tiltakstype) {
    case Tiltakstype.ARBFORB:
      return [
        VarighetValg.TRE_MANEDER,
        VarighetValg.SEKS_MANEDER,
        VarighetValg.TOLV_MANEDER
      ]
    case Tiltakstype.ARBRRHDAG:
      return [
        VarighetValg.FIRE_UKER,
        VarighetValg.ATTE_UKER,
        VarighetValg.TOLV_UKER
      ]
    case Tiltakstype.AVKLARAG:
      return [VarighetValg.FIRE_UKER, VarighetValg.ATTE_UKER]
    case Tiltakstype.INDOPPFAG:
      return [VarighetValg.TRE_MANEDER, VarighetValg.SEKS_MANEDER]
    case Tiltakstype.DIGIOPPARB:
      return [VarighetValg.FIRE_UKER]
    case Tiltakstype.VASV:
      return [VarighetValg.SEKS_MANEDER, VarighetValg.TOLV_MANEDER]
    case Tiltakstype.GRUFAGYRKE:
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

export const kalkulerSluttdato = (
  sluttdato: Date,
  varighet: Varighet
): Date => {
  return dayjs(sluttdato).add(varighet.antall, varighet.tidsenhet).toDate()
}

/**
 * Returnerer datoen som kommer først av deltakerlistens sluttdato
 * eller max varighet regnet ut fra 'nyStartdato' eller hvis den ikke er gitt; deltakerens startdato
 * @param pamelding
 * @param nyStartdato varighet regnes ut fra denne hvis gitt, ellers brukes deltakerens startdato
 */
export const getMaxVarighetDato = (
  pamelding: PameldingResponse,
  nyStartdato?: Date
) => {
  if (!pamelding.maxVarighet) {
    return null
  }
  if (nyStartdato && pamelding.maxVarighet) {
    return dayjs(nyStartdato).add(pamelding.maxVarighet, 'millisecond')
  }
  return pamelding.startdato
    ? dayjs(pamelding.startdato).add(pamelding.maxVarighet, 'millisecond')
    : null
}

export const getSkalBekrefteVarighet = (
  pamelding: PameldingResponse,
  nySluttDato?: Date | null,
  nyStartdato?: Date | null
) => {
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const startdato =
    nyStartdato ||
    (pamelding.startdato ? dayjs(pamelding.startdato).toDate() : undefined)
  const softMaxVarighetDato =
    startdato && pamelding.softMaxVarighet
      ? dayjs(startdato).add(pamelding.softMaxVarighet, 'millisecond')
      : null
  const maxVarighetDato = getMaxVarighetDato(pamelding, startdato)

  if (
    tiltakstype === Tiltakstype.ARBFORB ||
    (tiltakstype === Tiltakstype.INDOPPFAG && nySluttDato)
  ) {
    const erSluttDatoEtterSoftMaxDato =
      softMaxVarighetDato && dayjs(nySluttDato).isAfter(softMaxVarighetDato)
    const erSluttDatoForMaxDato = maxVarighetDato
      ? dayjs(nySluttDato).isSameOrBefore(maxVarighetDato)
      : true

    return erSluttDatoEtterSoftMaxDato && erSluttDatoForMaxDato
  } else return false
}

export const erSluttdatoEtterMaxVarighetsDato = (
  pamelding: PameldingResponse,
  sluttdato?: Date
) => {
  const maxVarighetDato = getMaxVarighetDato(pamelding)
  return maxVarighetDato
    ? !!sluttdato && dayjs(sluttdato).isAfter(maxVarighetDato)
    : false
}

export const getSoftMaxVarighetBekreftelseText = (tiltakstype: Tiltakstype) => {
  if (tiltakstype === Tiltakstype.INDOPPFAG) {
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
  if (tiltakstype === Tiltakstype.ARBFORB) {
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
  return null
}

export const VARIGHET_VALG_FØR_FEILMELDING =
  'Datoen kan ikke velges fordi den er før startdato.'
export const VARGIHET_VALG_FEILMELDING =
  'Datoen kan ikke velges fordi den er utenfor maks varighet.'
export const VARIGHET_BEKREFTELSE_FEILMELDING =
  'Du må bekrefte at deltakeren oppfyller kravene.'
export const UGYLDIG_DATO_FEILMELDING = 'Ugyldig dato'

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
  } else if (dayjs(deltakerlisteSluttDato).isAfter(maxVarighetDato)) {
    return maxVarighetDato.toDate()
  } else {
    return deltakerlisteSluttDato
  }
}
