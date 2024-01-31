import { z } from 'zod'
import { DeltakerStatusAarsakType } from './pamelding'

export const avbrytGrunnSchema = z.object({
  type: z.nativeEnum(DeltakerStatusAarsakType),
  beskrivelse: z.string().nullable()
})

export const avbrytRequestSchema = z.object({
  aarsak: avbrytGrunnSchema
})

export type AvbrytUtkastRequest = z.infer<typeof avbrytRequestSchema>
