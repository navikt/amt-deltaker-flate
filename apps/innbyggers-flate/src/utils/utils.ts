import dayjs from 'dayjs'
import { Tiltakstype, getTiltakstypeDisplayText } from 'deltaker-flate-common'

export const EMDASH = '—'

export const INNHOLD_TYPE_ANNET = 'annet'

export const hentTiltakNavnHosArrangørTekst = (
  tiltakstype: Tiltakstype,
  arrangorNavn: string
) => `${getTiltakstypeDisplayText(tiltakstype)} hos ${arrangorNavn}`

export const formatDateStrWithMonthName = (dateStr: string | null): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD. MMMM YYYY') : EMDASH
}

export const formatDateFromString = (dateStr: string | null): string => {
  if (!dateStr) return EMDASH
  const date = dayjs(dateStr)
  return date.isValid() ? date.format('DD.MM.YYYY') : EMDASH
}
