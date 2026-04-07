import { z } from 'zod'

export const arrangorEnhetResponseSchema = z.array(
  z.object({
    organisasjonsnummer: z.string(),
    navn: z.string()
  })
)

export type ArrangorEnhetResponse = z.infer<typeof arrangorEnhetResponseSchema>
