import { z } from 'zod'

export const enkeltplassPameldingSchema = z.object({
  beskrivelse: z.string(),
  prisinformasjon: z.string(),
  startdato: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/),
  sluttdato: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/),
  arrangorUnderenhet: z.string()
})

export type EnkeltplassPameldingRequest = z.infer<
  typeof enkeltplassPameldingSchema
>
