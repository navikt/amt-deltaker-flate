import { z } from 'zod'
import { prisinformasjonRequestSchema } from './kladd-request'

export const enkeltplassPameldingSchema = z.object({
  beskrivelse: z.string(),
  prisinformasjon: prisinformasjonRequestSchema,
  startdato: z.string(),
  sluttdato: z.string(),
  arrangorUnderenhet: z.string(),
  kodeverkValg: z.array(z.string()).optional(),
  sertifiseringValg: z
    .array(z.object({ id: z.number(), navn: z.string() }))
    .optional()
})

export type EnkeltplassPameldingRequest = z.infer<
  typeof enkeltplassPameldingSchema
>
