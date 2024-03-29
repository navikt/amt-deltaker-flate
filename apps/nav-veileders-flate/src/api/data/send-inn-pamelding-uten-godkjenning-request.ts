import { z } from 'zod'
import { innholdDtoSchema } from './send-inn-pamelding-request.ts'

export const sendInnPameldingUtenGodkjenningRequestSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  innhold: z.array(innholdDtoSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type SendInnPameldingUtenGodkjenningRequest = z.infer<
  typeof sendInnPameldingUtenGodkjenningRequestSchema
>
