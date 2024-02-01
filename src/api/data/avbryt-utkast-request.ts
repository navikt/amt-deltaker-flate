import { z } from 'zod'

export enum AvbrytUtkastGrunn {
  FATT_JOBB = 'FATT_JOBB',
  SYK = 'SYK',
  TRENGER_ANNEN_HJELP_STOTTE = 'TRENGER_ANNEN_HJELP_STOTTE',
  UTDANNING = 'UTDANNING',
  FEILREGISTRERT = 'FEILREGISTRERT',
  ANNET = 'ANNET'
}

export const avbrytGrunnSchema = z.object({
  type: z.nativeEnum(AvbrytUtkastGrunn),
  beskrivelse: z.string().nullable()
})

export const avbrytRequestSchema = z.object({
  aarsak: avbrytGrunnSchema
})

export type AvbrytUtkastRequest = z.infer<typeof avbrytRequestSchema>
