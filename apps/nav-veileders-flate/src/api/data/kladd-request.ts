import { z } from 'zod'
import { innholdDtoSchema } from './send-pamelding.ts'
import { OpplaringRepresenterer, Tiltakskode } from 'deltaker-flate-common'

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

export const enkeltplassKladdSchema = z.object({
  beskrivelse: z.string().optional(),
  prisinformasjon: z.string().optional(),
  startdato: z.string().optional(),
  sluttdato: z.string().optional(),
  arrangorUnderenhet: z.string().optional(),
  kodeverkValg: z
    .array(
      z.object({
        representerer: z.enum(OpplaringRepresenterer),
        valgteIder: z.array(z.string())
      })
    )
    .optional(),
  sertifiseringValg: z
    .array(z.object({ id: z.number(), navn: z.string() }))
    .optional()
})

export type KladdRequest = z.infer<typeof kladdSchema>
export type EnkeltplassKladdRequest = z.infer<typeof enkeltplassKladdSchema>
