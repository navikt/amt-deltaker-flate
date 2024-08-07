import { z } from 'zod'
import {
  deltakelsesinnholdSchema,
  deltakerStatusAarsakSchema,
  innholdSchema,
  stringToDate
} from './deltaker'
import { forslagSchema } from './forslag'

export enum EndringType {
  EndreStartdato = 'EndreStartdato',
  EndreSluttdato = 'EndreSluttdato',
  EndreDeltakelsesmengde = 'EndreDeltakelsesmengde',
  EndreBakgrunnsinformasjon = 'EndreBakgrunnsinformasjon',
  EndreInnhold = 'EndreInnhold',
  IkkeAktuell = 'IkkeAktuell',
  ForlengDeltakelse = 'ForlengDeltakelse',
  AvsluttDeltakelse = 'AvsluttDeltakelse',
  EndreSluttarsak = 'EndreSluttarsak',
  ReaktiverDeltakelse = 'ReaktiverDeltakelse'
}

export enum HistorikkType {
  Vedtak = 'Vedtak',
  Endring = 'Endring',
  Forslag = 'Forslag'
}

export const endreBakgrunnsinformasjonSchema = z.object({
  type: z.literal(EndringType.EndreBakgrunnsinformasjon),
  bakgrunnsinformasjon: z.string().nullable()
})

export const endreInnholdSchema = z.object({
  type: z.literal(EndringType.EndreInnhold),
  innhold: z.array(innholdSchema)
})

export const endreDeltakelsesmengdeSchema = z.object({
  type: z.literal(EndringType.EndreDeltakelsesmengde),
  deltakelsesprosent: z.number().nullable(),
  dagerPerUke: z.number().nullable()
})

export const endreStartdatoSchema = z.object({
  type: z.literal(EndringType.EndreStartdato),
  startdato: stringToDate,
  sluttdato: stringToDate
})

export const endreSluttdatoSchema = z.object({
  type: z.literal(EndringType.EndreSluttdato),
  sluttdato: stringToDate
})

export const forlengDeltakelseSchema = z.object({
  type: z.literal(EndringType.ForlengDeltakelse),
  sluttdato: stringToDate,
  begrunnelse: z.string().nullable()
})

export const ikkeAktuellSchema = z.object({
  type: z.literal(EndringType.IkkeAktuell),
  aarsak: deltakerStatusAarsakSchema
})

export const avsluttDeltakelseSchema = z.object({
  type: z.literal(EndringType.AvsluttDeltakelse),
  aarsak: deltakerStatusAarsakSchema,
  sluttdato: stringToDate
})

export const endreSluttarsakSchema = z.object({
  type: z.literal(EndringType.EndreSluttarsak),
  aarsak: deltakerStatusAarsakSchema
})

export const reaktiverDeltakelseSchema = z.object({
  type: z.literal(EndringType.ReaktiverDeltakelse),
  reaktivertDato: stringToDate
})

const endringSchema = z.discriminatedUnion('type', [
  endreBakgrunnsinformasjonSchema,
  endreInnholdSchema,
  endreDeltakelsesmengdeSchema,
  endreStartdatoSchema,
  endreSluttdatoSchema,
  forlengDeltakelseSchema,
  ikkeAktuellSchema,
  avsluttDeltakelseSchema,
  endreSluttarsakSchema,
  reaktiverDeltakelseSchema
])

export const vedtakSchema = z.object({
  type: z.literal(HistorikkType.Vedtak),
  fattet: stringToDate.nullable(),
  bakgrunnsinformasjon: z.string().nullable(),
  fattetAvNav: z.boolean(),
  deltakelsesinnhold: deltakelsesinnholdSchema,
  opprettetAv: z.string(),
  opprettetAvEnhet: z.string(),
  opprettet: stringToDate
})

export const deltakerEndringSchema = z.object({
  type: z.literal(HistorikkType.Endring),
  endring: endringSchema,
  endretAv: z.string(),
  endretAvEnhet: z.string(),
  endret: stringToDate,
  forslag: forslagSchema.nullable()
})

export const deltakerHistorikkSchema = z.discriminatedUnion('type', [
  vedtakSchema,
  deltakerEndringSchema,
  forslagSchema
])

export const deltakerHistorikkListeSchema = z.array(deltakerHistorikkSchema)

export type Endring = z.infer<typeof endringSchema>
export type DeltakerEndring = z.infer<typeof deltakerEndringSchema>
export type Vedtak = z.infer<typeof vedtakSchema>
export type DeltakerHistorikk = z.infer<typeof deltakerHistorikkSchema>
export type DeltakerHistorikkListe = z.infer<
  typeof deltakerHistorikkListeSchema
>
