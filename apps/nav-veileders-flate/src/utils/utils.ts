import dayjs from 'dayjs'
import { DeltakerStatusAarsakType, EMDASH } from 'deltaker-flate-common'

/**
 * Formaterer date til string: YYYY-MM-DD. Format slik backend vil ha.
 * @param date
 * @returns string date, format backend vil ha
 */
export const formatDateToDtoStr = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const formatDateToInputStr = (date: Date): string => {
  return dayjs(date).format('DD.MM.YYYY')
}

/**
 * Formaterer date til string: DD.MM.YYYY
 * @param date
 * @returns string date, norsk format
 */
export const formatDateToString = (date?: Date | null): string | undefined => {
  return date ? dayjs(date).format('DD.MM.YYYY') : undefined
}

export const dateStrToNullableDate = (dateStr: string | null): Date | null => {
  if (dateStr == null || dateStr == EMDASH) return null
  const date = dayjs(dateStr)
  return date.isValid() ? date.toDate() : null
}

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
    .filter(
      (type) =>
        type !== DeltakerStatusAarsakType.ANNET &&
        type !== DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT
    )
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
