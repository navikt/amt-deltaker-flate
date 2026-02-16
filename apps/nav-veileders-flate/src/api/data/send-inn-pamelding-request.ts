import { z } from 'zod'

export const innholdDtoSchema = z.object({
  innholdskode: z.string(),
  beskrivelse: z.string().nullable() //denne er i praksis satt hvis innholdskode=ANNET
})

export const sendInnPameldingRequestSchema = z.object({
  deltakerlisteId: z.uuid(),
  innhold: z.array(innholdDtoSchema),
  bakgrunnsinformasjon: z.string().optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type InnholdDto = z.infer<typeof innholdDtoSchema>
export type SendInnPameldingRequest = z.infer<
  typeof sendInnPameldingRequestSchema
>
