import {z} from 'zod'
import { innholdSchema } from './pamelding.ts'

export const sendInnPameldingUtenGodkjenningRequestSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  innhold: z.array(innholdSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type SendInnPameldingUtenGodkjenningRequest = z.infer<typeof sendInnPameldingUtenGodkjenningRequestSchema>
