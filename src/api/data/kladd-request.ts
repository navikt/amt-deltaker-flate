import { z } from 'zod'
import { innholdDtoSchema } from './send-inn-pamelding-request.ts'

export const kladdSchema = z.object({
  innhold: z.array(innholdDtoSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type KladdRequest = z.infer<typeof kladdSchema>
