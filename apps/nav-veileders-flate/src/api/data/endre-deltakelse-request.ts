import { z } from 'zod'
import { DeltakerStatusAarsakType } from 'deltaker-flate-common'
import { innholdDtoSchema } from './send-inn-pamelding-request'

export const aarsakSchema = z.object({
  type: z.enum(DeltakerStatusAarsakType),
  beskrivelse: z.string().nullable()
})

export const ikkeAktuellSchema = z.object({
  aarsak: aarsakSchema,
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})

export type IkkeAktuellRequest = z.infer<typeof ikkeAktuellSchema>

export const forlengDeltakelseSchema = z.object({
  sluttdato: z.string(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})

export type ForlengDeltakelseRequest = z.infer<typeof forlengDeltakelseSchema>

export const fjernOppstartsdatoSchema = z.object({
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})

export type FjernOppstartsdatoRequest = z.infer<typeof fjernOppstartsdatoSchema>

export const endreStartdatoSchema = z.object({
  startdato: z.string().nullable(),
  sluttdato: z.string().nullable(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullish()
})

export type EndreStartdatoRequest = z.infer<typeof endreStartdatoSchema>

export const endreBakgrunnsinfoSchema = z.object({
  bakgrunnsinformasjon: z.string().nullable()
})

export type EndreBakgrunnsinfoRequest = z.infer<typeof endreBakgrunnsinfoSchema>

export const avsluttDeltakelseSchema = z.object({
  aarsak: aarsakSchema.nullable(),
  sluttdato: z.string().nullable(),
  harDeltatt: z.boolean().nullable(),
  harFullfort: z.boolean().nullable(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})

export type AvsluttDeltakelseRequest = z.infer<typeof avsluttDeltakelseSchema>

export const endreAvslutningSchema = z.object({
  aarsak: aarsakSchema.nullable(),
  harDeltatt: z.boolean().nullable(),
  harFullfort: z.boolean().nullable(),
  sluttdato: z.string().nullable(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})

export type EndreAvslutningRequest = z.infer<typeof endreAvslutningSchema>

export const endreSluttarsakSchema = z.object({
  aarsak: aarsakSchema,
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullish()
})

export type EndreSluttarsakRequest = z.infer<typeof endreSluttarsakSchema>

export const endreInnholdSchema = z.object({
  innhold: z.array(innholdDtoSchema)
})

export type EndreInnholdRequest = z.infer<typeof endreInnholdSchema>

export const endreDeltakelsesmengdeSchema = z.object({
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional(),
  gyldigFra: z.string(),
  begrunnelse: z.string().nullable(),
  forslagId: z.string().nullable()
})

export type EndreDeltakelsesmengdeRequest = z.infer<
  typeof endreDeltakelsesmengdeSchema
>

export const avvisForslagSchema = z.object({
  begrunnelse: z.string()
})

export type AvvisForslagRequest = z.infer<typeof avvisForslagSchema>

export const reaktiverDeltakelseSchema = z.object({
  begrunnelse: z.string()
})

export type ReaktiverDeltakelseRequest = z.infer<
  typeof reaktiverDeltakelseSchema
>

export type EndringRequest =
  | IkkeAktuellRequest
  | ForlengDeltakelseRequest
  | EndreStartdatoRequest
  | EndreBakgrunnsinfoRequest
  | AvsluttDeltakelseRequest
  | EndreSluttarsakRequest
  | EndreInnholdRequest
  | EndreDeltakelsesmengdeRequest
  | ReaktiverDeltakelseRequest
  | EndreAvslutningRequest
  | FjernOppstartsdatoRequest
