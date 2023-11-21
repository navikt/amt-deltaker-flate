import {z} from 'zod'
import {malSchema} from './pamelding.ts'

export const sendInnPameldingRequestSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  mal: z.array(malSchema),
  bakgrunnsinformasjon: z.string().nullable(),
  deltakelsesprosent: z.number().nullable(),
  dagerPerUke: z.number().nullable()
})

export type SendInnPameldingRequest = z.infer<typeof sendInnPameldingRequestSchema>
