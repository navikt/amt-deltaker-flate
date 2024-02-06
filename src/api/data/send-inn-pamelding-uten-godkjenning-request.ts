import {z} from 'zod'
import {malSchema} from './pamelding.ts'

export const sendInnPameldingUtenGodkjenningRequestSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  mal: z.array(malSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type SendInnPameldingUtenGodkjenningRequest = z.infer<typeof sendInnPameldingUtenGodkjenningRequestSchema>
