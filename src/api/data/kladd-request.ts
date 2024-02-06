import {z} from 'zod'
import { innholdSchema } from './pamelding.ts'

export const kladdSchema = z.object({
  innhold: z.array(innholdSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type KladdRequest = z.infer<typeof kladdSchema>
