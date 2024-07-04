import { z } from 'zod'

export enum ForslagStatusType {
  VenterPaSvar = 'VenterPaSvar'
}

export enum ForslagEndringType {
  ForlengDeltakelse = 'ForlengDeltakelse'
}

export const forlengDeltakelseForslagSchema = z.object({
  type: z.literal(ForslagEndringType.ForlengDeltakelse),
  sluttdato: z.string()
})

export const forslagEndringSchema = z.discriminatedUnion('type', [
  forlengDeltakelseForslagSchema
])

const venterPaSvarSchema = z.object({
  type: z.literal(ForslagStatusType.VenterPaSvar)
})

const statusSchema = z.discriminatedUnion('type', [venterPaSvarSchema])

export const aktivtForslagSchema = z.object({
  id: z.string().uuid(),
  opprettet: z.string(),
  begrunnelse: z.string().nullable(),
  endring: forslagEndringSchema,
  status: statusSchema.default({ type: ForslagStatusType.VenterPaSvar })
})

export type AktivtForslag = z.infer<typeof aktivtForslagSchema>
export type ForslagEndring = z.infer<typeof forslagEndringSchema>
export type ForlengDeltakelseForslag = z.infer<
  typeof forlengDeltakelseForslagSchema
>
