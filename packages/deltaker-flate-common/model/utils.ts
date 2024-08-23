import dayjs from 'dayjs'
import { z } from 'zod'

export const dateSchema = z.preprocess((arg) => {
  if (typeof arg == 'string') return dayjs(arg).toDate()
}, z.date())

export const nullableDateSchema = z.preprocess((arg) => {
  if (!arg) return null
  if (typeof arg == 'string') return dayjs(arg).toDate()
}, z.date().nullable())
