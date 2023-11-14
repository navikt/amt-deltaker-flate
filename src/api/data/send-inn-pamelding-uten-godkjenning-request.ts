import {z} from 'zod'
import {malSchema} from './pamelding.ts'

export const begrunnelseSchema = z.object({
  type: z.string(),
  beskrivelse: z.string().nullable()
})

export const sendInnPameldingUtenGodkjenningRequestSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  mal: z.array(malSchema),
  bakgrunnsinformasjon: z.string().nullable(),
  deltakelsesprosent: z.number().nullable(),
  dagerPerUke: z.number().nullable(),
  begrunnelse: begrunnelseSchema
})

export type SendInnPameldingUtenGodkjenningRequest = z.infer<typeof sendInnPameldingUtenGodkjenningRequestSchema>
