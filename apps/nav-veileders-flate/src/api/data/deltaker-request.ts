import { z } from 'zod'

export const deltakerRequestSchema = z.object({
  personident: z.string()
})
export type DeltakerRequest = z.infer<typeof deltakerRequestSchema>
