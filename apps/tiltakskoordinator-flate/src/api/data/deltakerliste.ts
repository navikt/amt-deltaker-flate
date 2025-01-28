import {
  deltakerStatusAarsakTypeSchema,
  deltakerStatusTypeSchema,
  nullableDateSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

const deltakerStatusAarsakSchema = z.object({
  type: deltakerStatusAarsakTypeSchema
})

const deltakerStatusSchema = z.object({
  type: deltakerStatusTypeSchema,
  aarsak: deltakerStatusAarsakSchema.nullable()
})

export const deltakerSchema = z.object({
  id: z.string().uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  status: deltakerStatusSchema
})

export const deltakereSchema = z.array(deltakerSchema)

export const deltakerlisteDetaljerSchema = z.object({
  id: z.string().uuid(),
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  apentForPamelding: z.boolean(),
  antallPlasser: z.number()
})

export type Deltaker = z.infer<typeof deltakerSchema>
export type Deltakere = z.infer<typeof deltakereSchema>
export type DeltakerlisteDetaljer = z.infer<typeof deltakerlisteDetaljerSchema>
