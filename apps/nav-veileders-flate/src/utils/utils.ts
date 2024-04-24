import dayjs from 'dayjs'
import { DeltakerStatusAarsakType } from 'deltaker-flate-common'

export const EMDASH = '—'

export const formatDateFromString = (dateStr: string | null): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD.MM.YYYY') : EMDASH
}

export const formatDateStrWithMonthName = (dateStr: string | null): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD. MMMM YYYY') : EMDASH
}

/**
 * Formaterer date til string: YYYY-MM-DD. Format slik backend vil ha.
 * @param date
 * @returns string date, format backend vil ha
 */
export const formatDateToDateInputStr = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * Formaterer date til string: DD.MM.YYYY
 * @param date
 * @returns string date, norsk format
 */
export const formatDateToString = (date?: Date): string | undefined => {
  return date ? dayjs(date).format('DD.MM.YYYY') : undefined
}

export const dateStrToNullableDate = (dateStr: string | null): Date | null => {
  if (dateStr == null || dateStr == EMDASH) return null
  const date = dayjs(dateStr, 'DD.MM.YYYY')
  return date.isValid() ? date.toDate() : null
}

export const dateStrToDate = (dateStr: string): Date => {
  const date = dayjs(dateStr, 'DD.MM.YYYY')
  return date.toDate()
}

export const INNHOLD_TYPE_ANNET = 'annet'

export enum DeltakelsesprosentValg {
  JA = 'JA',
  NEI = 'NEI'
}

export const isValidFloatInRange = (
  value: string,
  from: number,
  to: number
) => {
  const valueCorrected = value.replace(',', '.')
  const x = parseFloat(valueCorrected)

  return !(isNaN(x) || x < from || x > to)
}

export const erGyldigProsent = (value: string) => {
  return isValidFloatInRange(value, 0, 100)
}

export const erGyldigDagerPerUke = (value: string) => {
  return isValidFloatInRange(value, 0, 7)
}

export const getDeltakerStatusAarsakTyperAsList = () => {
  const arsakstyper = Object.keys(DeltakerStatusAarsakType)
    .filter((type) => type !== DeltakerStatusAarsakType.ANNET)
    .map((typeString) => {
      // @ts-expect-error: arsakType is made from DeltakerStatusAarsakType keys
      const typeKey: keyof typeof DeltakerStatusAarsakType = typeString
      return DeltakerStatusAarsakType[typeKey]
    })
  return arsakstyper.concat(DeltakerStatusAarsakType.ANNET)
}

export enum HarDeltattValg {
  JA = 'JA',
  NEI = 'NEI'
}
