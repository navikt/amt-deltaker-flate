import {
  IngenKostnaderAarsak,
  PrisinformasjonType,
  Tilskuddstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { z } from 'zod'
import { innholdDtoSchema } from './send-pamelding.ts'

export const opprettKladdRequestSchema = z.object({
  deltakerlisteId: z.uuid(),
  personident: z.string()
})

export const opprettEnkeltplassKladdRequestSchema = z.object({
  tiltakskode: z.enum(Tiltakskode),
  personident: z.string()
})

export type OpprettKladdRequest = z.infer<typeof opprettKladdRequestSchema>
export type OpprettEnkeltplassKladdRequest = z.infer<
  typeof opprettEnkeltplassKladdRequestSchema
>

export const kladdSchema = z.object({
  innhold: z.array(innholdDtoSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

// Enkeltplass
const anskaffelseSchema = z.object({
  type: z.literal(PrisinformasjonType.Anskaffelse),
  pris: z.int()
})

const tilskuddSchema = z.object({
  type: z.literal(PrisinformasjonType.Tilskudd),
  tilskudd: z.partialRecord(z.enum(Tilskuddstype), z.int()),
  tilleggsopplysninger: z.string().nullish()
})

const ingenKostnaderSchema = z.object({
  type: z.literal(PrisinformasjonType.IngenKostnader),
  aarsak: z.enum(IngenKostnaderAarsak),
  tilleggsopplysninger: z.string().nullish()
})

export const prisinformasjonRequestSchema = z.discriminatedUnion('type', [
  anskaffelseSchema,
  tilskuddSchema,
  ingenKostnaderSchema
])

export const enkeltplassKladdSchema = z.object({
  beskrivelse: z.string().optional(),
  prisinformasjon: prisinformasjonRequestSchema.nullable(),
  startdato: z.string().optional(),
  sluttdato: z.string().optional(),
  arrangorUnderenhet: z.string().optional(),
  kodeverkValg: z.array(z.string()).optional(),
  sertifiseringValg: z
    .array(z.object({ id: z.number(), navn: z.string() }))
    .optional()
})

export type KladdRequest = z.infer<typeof kladdSchema>
export type EnkeltplassKladdRequest = z.infer<typeof enkeltplassKladdSchema>
export type PrisinformasjonKladd = z.infer<typeof prisinformasjonRequestSchema>
