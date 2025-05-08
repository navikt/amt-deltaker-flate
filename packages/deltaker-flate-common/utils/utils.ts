import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { EMDASH } from './constants'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  ArenaTiltakskode,
  DeltakerStatusAarsakType,
  Oppstartstype
} from '../model/deltaker'

dayjs.locale(nb)
dayjs.extend(customParseFormat)

/**
 * Returns true if date is not null or undefined and is a valid date.
 */
export const isValidDate = (date?: string | null) => {
  return date ? dayjs(date).isValid() : false
}

export const getDateFromString = (dateString?: string | null) => {
  return dateString && dayjs(dateString).isValid()
    ? dayjs(dateString).toDate()
    : undefined
}

/**
 * Returns a string representing the date displying month name ('DD. MMMM YYYY')
 * Returnerer en Date fra string fra DatePicker.Input komponenten.
 * @param dateString Dato string fra DatePicker.Input komponenten.
 * @returns
 */
export const getDateFromNorwegianStringFormat = (
  dateString?: string | null
) => {
  if (!dateString) return undefined

  const firstDotIndex = dateString.indexOf('.')
  const seccondDotIndex = dateString.indexOf('.', firstDotIndex + 1)

  const date = dateString.substring(0, firstDotIndex)
  const month = dateString.substring(firstDotIndex + 1, seccondDotIndex)
  const year = dateString.substring(seccondDotIndex + 1, dateString.length)

  const validDateString = `${month}.${date}.${year}`

  return dayjs(validDateString).isValid()
    ? dayjs(validDateString).toDate()
    : undefined
}

/**
 * Returns a string represaenting the date displying month name ('DD. MMMM YYYY')
 * @param dateStr Date as string
 * @returns date string with format 'DD. MMMM YYYY'
 */
export const formatDateStrWithMonthName = (
  dateStr: string | null | undefined
): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD. MMMM YYYY') : EMDASH
}

/**
 * Returns a string representing the date displying month name ('DD. MMMM YYYY')
 * @param date Date as string
 * @returns date string with format 'DD. MMMM YYYY'
 */
export const formatDateWithMonthName = (
  date: Date | null | undefined
): string => {
  if (!date) return EMDASH
  const d = dayjs(date)
  return d.isValid() ? d.format('D. MMMM YYYY') : EMDASH
}

/**
 * Returns a string representing the date displying month number ('DD.MM.YYYY')
 * @param date Date as string
 * @returns date string with format 'DD.MM.YYYY'
 */
export const formatDate = (date: Date | null | undefined): string => {
  if (!date) return EMDASH
  const d = dayjs(date)
  return d.isValid() ? d.format('DD.MM.YYYY') : EMDASH
}

/**
 * Returns a string representing the date using month number ('DD. MM YYYY')
 * @param dateStr Date as string
 * @returns date string with format 'DD. MM YYYY'
 */
export const formatDateFromString = (
  dateStr: string | null | undefined
): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD.MM.YYYY') : EMDASH
}

export const visDeltakelsesmengde = (tiltakstype: ArenaTiltakskode) => {
  return (
    tiltakstype === ArenaTiltakskode.ARBFORB ||
    tiltakstype === ArenaTiltakskode.VASV
  )
}

export const logError = (message: string, ...args: unknown[]) => {
  console.error(`AMT_LOGS: ${message}`, args)
}

export const haveSameContents = (list1: unknown[], list2: unknown[]) =>
  list1.length === list2.length &&
  [...new Set([...list1, ...list2])].every(
    (v) =>
      list1.filter((e) => e === v).length ===
      list2.filter((e) => e === v).length
  )

export const fjernUgyldigeTegn = (str: string) => {
  const ugyldigeTegnRegex =
    /[^a-zA-ZæøåÆØÅ0-9 \s.,@<>'`!"#$%&\/()\\=?*<;:>*§_-]/g
  const stringUtenNonBreakingSace = str.replace(/\u00A0/g, ' ')
  const stringUtenZeroWidthNonBreakingSace = stringUtenNonBreakingSace.replace(
    /\uFEFF/g,
    ''
  )
  return stringUtenZeroWidthNonBreakingSace.replace(ugyldigeTegnRegex, '')
}

export const kanDeleDeltakerMedArrangor = (
  tiltaksType: ArenaTiltakskode,
  oppstartstype: Oppstartstype
) =>
  oppstartstype === Oppstartstype.FELLES &&
  [ArenaTiltakskode.GRUPPEAMO, ArenaTiltakskode.GRUFAGYRKE].includes(
    tiltaksType
  )

export const erKursEllerDigitalt = (tiltaksType: ArenaTiltakskode) =>
  [
    ArenaTiltakskode.DIGIOPPARB,
    ArenaTiltakskode.JOBBK,
    ArenaTiltakskode.GRUPPEAMO,
    ArenaTiltakskode.GRUFAGYRKE
  ].includes(tiltaksType)

export const erKursTiltak = (tiltaksType: ArenaTiltakskode) =>
  [
    ArenaTiltakskode.JOBBK,
    ArenaTiltakskode.GRUPPEAMO,
    ArenaTiltakskode.GRUFAGYRKE
  ].includes(tiltaksType)

export const harFellesOppstart = (oppstartstype: Oppstartstype) =>
  oppstartstype === Oppstartstype.FELLES

export const getDeltakerStatusAarsakTypeText = (
  type: DeltakerStatusAarsakType
) => {
  switch (type) {
    case DeltakerStatusAarsakType.ANNET:
      return 'Annet - fyll ut'
    case DeltakerStatusAarsakType.FATT_JOBB:
      return 'Fått jobb'
    case DeltakerStatusAarsakType.IKKE_MOTT:
      return 'Møter ikke opp'
    case DeltakerStatusAarsakType.SYK:
      return 'Syk'
    case DeltakerStatusAarsakType.TRENGER_ANNEN_STOTTE:
      return 'Trenger annen hjelp og støtte'
    case DeltakerStatusAarsakType.UTDANNING:
      return 'Utdanning'
    case DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT:
      return 'Samarbeidet med arrangøren er avbrutt'
    case DeltakerStatusAarsakType.FIKK_IKKE_PLASS:
      return 'Fikk ikke plass'
    case DeltakerStatusAarsakType.KURS_FULLT:
      return 'Kurset er fullt'
    case DeltakerStatusAarsakType.KRAV_IKKE_OPPFYLT:
      return 'Krav for deltakelse er ikke oppfylt'
  }
}
