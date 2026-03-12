import { z } from 'zod'
import { innholdDtoSchema } from './utkast-request.ts'
import { Tiltakskode } from 'deltaker-flate-common'

export const opprettKladdRequestSchema = z.object({
  deltakerlisteId: z.uuid(),
  personident: z.string()
})

export const opprettKladdEnkeltplassRequestSchema = z.object({
  tiltakskode: z.enum(Tiltakskode),
  personident: z.string()
})

export type OpprettKladdRequest = z.infer<typeof opprettKladdRequestSchema>
export type OpprettKladdEnkeltplassRequest = z.infer<
  typeof opprettKladdEnkeltplassRequestSchema
>

export const kladdSchema = z.object({
  innhold: z.array(innholdDtoSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type KladdRequest = z.infer<typeof kladdSchema>
