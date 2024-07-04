import { z } from 'zod'

export enum ForslagEndringType {
  ForlengDeltakelse = 'ForlengDeltakelse',
  EndreStartdato = 'EndreStartdato'
}

export const forlengDeltakelseForslagSchema = z.object({
  type: z.literal(ForslagEndringType.ForlengDeltakelse),
  sluttdato: z.string()
})

export const endreStartdatoForslagSchema = z.object({
  type: z.literal(ForslagEndringType.EndreStartdato),
  startdato: z.string()
})

export const forslagEndringSchema = forlengDeltakelseForslagSchema.or(
  endreStartdatoForslagSchema
)

export const forslagSchema = z.object({
  id: z.string().uuid(),
  opprettet: z.string(),
  begrunnelse: z.string(),
  endring: forslagEndringSchema
})

export type Forslag = z.infer<typeof forslagSchema>
export type ForlengDeltakelseForslag = z.infer<
  typeof forlengDeltakelseForslagSchema
>
