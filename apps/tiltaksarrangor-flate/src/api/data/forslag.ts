import { z } from 'zod'
import {
  ForslagEndringType,
  ForslagStatusType,
  HistorikkType,
  fjernOppstartsdatoForslagSchema,
  forlengDeltakelseForslagSchema,
  forslagSchema,
  ikkeAktuellForslagSchema,
  sluttdatoForslagSchema,
  sluttarsakForslagSchema
} from 'deltaker-flate-common'

import { dateSchema, nullableDateSchema } from '../utils'

const endringAarsakSchema = ikkeAktuellForslagSchema.shape.aarsak

const avsluttDeltakelseSchema = z.object({
  type: z.literal(ForslagEndringType.AvsluttDeltakelse),
  sluttdato: dateSchema.nullable(),
  aarsak: endringAarsakSchema.nullable(),
  harDeltatt: z.boolean().nullable(),
  harFullfort: z.boolean().nullable()
})

export const endreAvslutningForslagSchema = z.object({
  type: z.literal(ForslagEndringType.EndreAvslutning),
  aarsak: endringAarsakSchema.nullable(),
  harDeltatt: z.boolean().nullable(),
  harFullfort: z.boolean().optional().nullable(),
  sluttdato: nullableDateSchema
})

const deltakelsesmengdeSchema = z.object({
  type: z.literal(ForslagEndringType.Deltakelsesmengde),
  deltakelsesprosent: z.number(),
  dagerPerUke: z.number().nullable(),
  gyldigFra: dateSchema.nullable()
})

const startdatoSchema = z.object({
  type: z.literal(ForslagEndringType.Startdato),
  startdato: dateSchema,
  sluttdato: dateSchema.nullable()
})

const endringSchema = z.discriminatedUnion('type', [
  forlengDeltakelseForslagSchema,
  ikkeAktuellForslagSchema,
  avsluttDeltakelseSchema,
  endreAvslutningForslagSchema,
  deltakelsesmengdeSchema,
  sluttdatoForslagSchema,
  startdatoSchema,
  sluttarsakForslagSchema,
  fjernOppstartsdatoForslagSchema
])

const statusSchema = forslagSchema.shape.status

export const aktivtForslagSchema = z.object({
  id: z.uuid(),
  opprettet: dateSchema,
  begrunnelse: z.string().nullable(),
  endring: endringSchema,
  status: statusSchema.default({ type: ForslagStatusType.VenterPaSvar })
})

export const historikkForslagSchema = z.object({
  id: z.uuid(),
  type: z.literal(HistorikkType.Forslag),
  opprettet: dateSchema,
  begrunnelse: z.string().nullable(),
  arrangorNavn: z.string(),
  endring: endringSchema,
  status: statusSchema
})

export type HistorikkForslag = z.infer<typeof historikkForslagSchema>
export type AktivtForslag = z.infer<typeof aktivtForslagSchema>
export type ForslagEndring = z.infer<typeof endringSchema>
export type EndringAarsak = z.infer<typeof endringAarsakSchema>
