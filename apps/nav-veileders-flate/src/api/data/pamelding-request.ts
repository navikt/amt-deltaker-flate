import { z } from 'zod'

export const pameldingRequestSchema = z.object({
  deltakerlisteId: z.uuid(),
  personident: z.string()
})

export const deltakerRequestSchema = z.object({
  personident: z.string()
})

export type PameldingRequest = z.infer<typeof pameldingRequestSchema>
export type DeltakerRequest = z.infer<typeof deltakerRequestSchema>
