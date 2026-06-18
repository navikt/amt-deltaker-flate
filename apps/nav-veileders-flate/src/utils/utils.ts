import dayjs from 'dayjs'
import {
  EMDASH,
  Prisinformasjon,
  PrisinformasjonType
} from 'deltaker-flate-common'
import { FormPrisinformasjon } from '../model/PameldingEnkeltplassFormValues'

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

export const dateToIsoString = (date: Date | null): string => {
  const parsedDate = date ? dayjs(date) : null
  return parsedDate?.isValid() ? formatDateToDtoStr(parsedDate.toDate()) : ''
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

export const NOK_FORMATTER = new Intl.NumberFormat('nb-NO')

export const beregnEstimertTotalsum = (
  prisinformasjon: FormPrisinformasjon | Prisinformasjon
) => {
  if (
    !prisinformasjon ||
    prisinformasjon.type !== PrisinformasjonType.Tilskudd
  ) {
    return 0
  }

  let sum = 0
  for (const item of prisinformasjon.tilskudd) {
    sum += item.belop ?? 0
  }
  return sum
}
