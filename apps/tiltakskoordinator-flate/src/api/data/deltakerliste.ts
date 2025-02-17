import {
  deltakerStatusAarsakTypeSchema,
  deltakerStatusTypeSchema,
  nullableDateSchema,
  tiltakskodeSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

export enum Beskyttelsesmarkering {
  FORTROLIG = 'FORTROLIG',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
  SKJERMET = 'SKJERMET'
}

const deltakerStatusAarsakSchema = z.object({
  type: deltakerStatusAarsakTypeSchema
})

const deltakerStatusSchema = z.object({
  type: deltakerStatusTypeSchema,
  aarsak: deltakerStatusAarsakSchema.nullable()
})

const beskyttelsesmarkeringSchema = z.nativeEnum(Beskyttelsesmarkering)

export enum Vurderingstype {
  OPPFYLLER_KRAVENE = 'OPPFYLLER_KRAVENE',
  OPPFYLLER_IKKE_KRAVENE = 'OPPFYLLER_IKKE_KRAVENE'
}
export const vurderingstypeSchema = z.nativeEnum(Vurderingstype)

export const deltakerSchema = z.object({
  id: z.string().uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  status: deltakerStatusSchema,
  vurdering: vurderingstypeSchema.nullable(),
  beskyttelsesmarkering: z.array(beskyttelsesmarkeringSchema)
})

export const deltakereSchema = z.array(deltakerSchema)

const koordinator = z.object({
  id: z.string().uuid(),
  navn: z.string()
})

export const deltakerlisteDetaljerSchema = z.object({
  id: z.string().uuid(),
  tiltakskode: tiltakskodeSchema,
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  apentForPamelding: z.boolean(),
  antallPlasser: z.number(),
  koordinatorer: z.array(koordinator)
})

export type Deltaker = z.infer<typeof deltakerSchema>
export type Deltakere = z.infer<typeof deltakereSchema>
export type DeltakerlisteDetaljer = z.infer<typeof deltakerlisteDetaljerSchema>
