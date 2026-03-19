import { z } from 'zod'

export const enkeltplassPameldingSchema = z.object({
  beskrivelse: z.string(),
  prisinformasjon: z.string(),
  startdato: z.date().optional(),
  sluttdato: z.date().optional()
})

export type EnkeltplassPameldingRequest = z.infer<
  typeof enkeltplassPameldingSchema
>
