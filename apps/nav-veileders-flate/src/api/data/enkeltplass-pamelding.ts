import { OpplaringRepresenterer } from 'deltaker-flate-common'
import { z } from 'zod'

export const enkeltplassPameldingSchema = z.object({
  beskrivelse: z.string(),
  prisinformasjon: z.string(),
  startdato: z.string(),
  sluttdato: z.string(),
  arrangorUnderenhet: z.string(),
  kodeverkValg: z
    .array(
      z.object({
        representerer: z.enum(OpplaringRepresenterer),
        valgteIder: z.array(z.string())
      })
    )
    .optional(),
  sertifiseringValg: z
    .array(z.object({ id: z.number(), navn: z.string() }))
    .optional()
})

export type EnkeltplassPameldingRequest = z.infer<
  typeof enkeltplassPameldingSchema
>
