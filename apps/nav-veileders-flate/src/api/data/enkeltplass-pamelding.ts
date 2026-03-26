import { z } from 'zod'

export const enkeltplassPameldingSchema = z.object({
  beskrivelse: z.string(),
  prisinformasjon: z.string(),
  startdato: z.string().optional(),
  sluttdato: z.string().optional()
})

export type EnkeltplassPameldingRequest = z.infer<
  typeof enkeltplassPameldingSchema
>
