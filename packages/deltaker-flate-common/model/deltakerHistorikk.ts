import { z } from 'zod'
import {
  deltakelsesinnholdSchema,
  deltakerStatusAarsakSchema,
  innholdSchema,
  stringToDate
} from './deltaker'
import { forslagEndringSchema, ForslagStatusType } from './forslag'

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

export const forslagAvvistSchema = z.object({
  type: z.literal(ForslagStatusType.Avvist),
  avvistAv: z.string(),
  avvistAvEnhet: z.string(),
  avvist: stringToDate,
  begrunnelseFraNav: z.string()
})
export const forslagTilbakekaltSchema = z.object({
  type: z.literal(ForslagStatusType.Tilbakekalt),
  tilbakekalt: stringToDate
})
export const forslagErstattetSchema = z.object({
  type: z.literal(ForslagStatusType.Erstattet),
  erstattet: stringToDate
})

export const forslagStatusSchema = forslagAvvistSchema
  .or(forslagTilbakekaltSchema)
  .or(forslagErstattetSchema)

export const deltakerEndringSchema = z.object({
  type: z.literal(HistorikkType.Endring),
  endring: endringSchema,
  endretAv: z.string(),
  endretAvEnhet: z.string(),
  endret: stringToDate
})

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

export const forslagSchema = z.object({
  type: z.literal(HistorikkType.Forslag),
  opprettet: stringToDate,
  begrunnelseFraArrangor: z.string().nullable(),
  arrangorNavn: z.string(),
  endring: forslagEndringSchema,
  status: forslagStatusSchema
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
export type Forslag = z.infer<typeof forslagSchema>
export type DeltakerHistorikk = z.infer<typeof deltakerHistorikkSchema>
export type DeltakerHistorikkListe = z.infer<
  typeof deltakerHistorikkListeSchema
>
