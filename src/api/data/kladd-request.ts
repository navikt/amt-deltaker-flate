import {z} from 'zod'
import { malSchema } from './pamelding.ts'

export const kladdSchema = z.object({
  mal: z.array(malSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type KladdRequest = z.infer<typeof kladdSchema>
