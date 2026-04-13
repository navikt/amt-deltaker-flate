import { z } from 'zod'

export const enkeltplassPameldingSchema = z.object({
  beskrivelse: z.string(),
  prisinformasjon: z.string(),
  startdato: z.string(),
  sluttdato: z.string(),
  arrangorUnderenhet: z.string()
})

export type EnkeltplassPameldingRequest = z.infer<
  typeof enkeltplassPameldingSchema
>
