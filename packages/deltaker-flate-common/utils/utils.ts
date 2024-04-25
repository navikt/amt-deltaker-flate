import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { EMDASH } from './constants'

dayjs.locale(nb)

/**
 * Returns a string represaenting the date displying month name ('DD. MMMM YYYY')
 * @param dateStr Date as string
 * @returns date string with format 'DD. MMMM YYYY'
 */
export const formatDateStrWithMonthName = (dateStr: string | null): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD. MMMM YYYY') : EMDASH
}

/**
 * Returns a string represaenting the date using month number ('DD. MM YYYY')
 * @param dateStr Date as string
 * @returns date string with format 'DD. MM YYYY'
 */
export const formatDateFromString = (dateStr: string | null): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD.MM.YYYY') : EMDASH
}
