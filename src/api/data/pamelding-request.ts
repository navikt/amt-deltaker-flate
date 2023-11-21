import { z } from 'zod'

export const pameldingRequestSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  personident: z.string()
})

export type PameldingRequest = z.infer<typeof pameldingRequestSchema>
