import { z } from 'zod'
import { DeltakerStatusAarsakType } from './pamelding.ts'
import {innholdDtoSchema} from './send-inn-pamelding-request'

export enum EndreDeltakelseType {
  IKKE_AKTUELL = 'IKKE_AKTUELL',
  ENDRE_INNHOLD = 'ENDRE_INNHOLD',
  ENDRE_BAKGRUNNSINFO = 'ENDRE_BAKGRUNNSINFO',
  ENDRE_SLUTTARSAK = 'ENDRE_SLUTTARSAK',
  ENDRE_SLUTTDATO = 'ENDRE_SLUTTDATO',
  ENDRE_OPPSTARTSDATO = 'ENDRE_OPPSTARTSDATO',
  FORLENG_DELTAKELSE = 'FORLENG_DELTAKELSE',
  AVSLUTT_DELTAKELSE = 'AVSLUTT_DELTAKELSE'
}

export const BESKRIVELSE_ARSAK_ANNET_MAX_TEGN = 40

export const aarsakSchema = z.object({
  type: z.nativeEnum(DeltakerStatusAarsakType),
  beskrivelse: z.string().nullable()
})

export const ikkeAktuellSchema = z.object({
  aarsak: aarsakSchema
})

export type IkkeAktuellRequest = z.infer<typeof ikkeAktuellSchema>

export const forlengDeltakelseSchema = z.object({
  sluttdato: z.string()
})

export type ForlengDeltakelseRequest = z.infer<typeof forlengDeltakelseSchema>

export const endreStartdatoSchema = z.object({
  startdato: z.string()
})

export type EndreStartdatoRequest = z.infer<typeof endreStartdatoSchema>

export const endreBakgrunnsinfoSchema = z.object({
  bakgrunnsinformasjon: z.string().nullable()
})

export type EndreBakgrunnsinfoRequest = z.infer<typeof endreBakgrunnsinfoSchema>

export const endreSluttdatoSchema = z.object({
  sluttdato: z.string()
})

export type EndreSluttdatoRequest = z.infer<typeof endreSluttdatoSchema>

export const avsluttDeltakelseSchema = z.object({
  aarsak: aarsakSchema,
  sluttdato: z.string()
})

export type AvsluttDeltakelseRequest = z.infer<typeof avsluttDeltakelseSchema>

export const endreSluttarsakSchema = z.object({
  aarsak: aarsakSchema
})

export type EndreSluttarsakRequest = z.infer<typeof endreSluttarsakSchema>

export const endreInnholdSchema = z.object({
  innhold: z.array(innholdDtoSchema)
})

export type EndreInnholdRequest = z.infer<typeof endreInnholdSchema>
