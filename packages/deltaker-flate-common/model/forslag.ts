import { z } from 'zod'

export enum ForslagStatusType {
  VenterPaSvar = 'VenterPaSvar'
}

export enum ForslagEndringType {
  ForlengDeltakelse = 'ForlengDeltakelse',
  AvsluttDeltakelse = 'AvsluttDeltakelse',
  IkkeAktuell = 'IkkeAktuell'
}

export enum ForslagEndringAarsakType {
  Syk = 'Syk',
  FattJobb = 'FattJobb',
  TrengerAnnenStotte = 'TrengerAnnenStotte',
  FikkIkkePlass = 'FikkIkkePlass',
  Utdanning = 'Utdanning',
  IkkeMott = 'IkkeMott',
  Annet = 'Annet'
}

export const forslagEndringAarsakTypeSchema = z.nativeEnum(
  ForslagEndringAarsakType
)

export const forslagEndringAarsakSchema = z.object({
  type: forslagEndringAarsakTypeSchema,
  beskrivelse: z.string().nullable()
})

export const forlengDeltakelseForslagSchema = z.object({
  type: z.literal(ForslagEndringType.ForlengDeltakelse),
  sluttdato: z.string()
})

export const avsluttDeltakelseForslagSchema = z.object({
  type: z.literal(ForslagEndringType.AvsluttDeltakelse),
  sluttdato: z.string(),
  aarsak: forslagEndringAarsakSchema
})

export const ikkeAktuellForslagSchema = z.object({
  type: z.literal(ForslagEndringType.IkkeAktuell),
  aarsak: forslagEndringAarsakSchema
})

export const forslagEndringSchema = z.discriminatedUnion('type', [
  forlengDeltakelseForslagSchema,
  avsluttDeltakelseForslagSchema,
  ikkeAktuellForslagSchema
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
export type ForslagEndringAarsak = z.infer<typeof forslagEndringAarsakSchema>
export type ForlengDeltakelseForslag = z.infer<
  typeof forlengDeltakelseForslagSchema
>
export type AvsluttDeltakelseForslag = z.infer<
  typeof avsluttDeltakelseForslagSchema
>
export type IkkeAktuellForslag = z.infer<typeof ikkeAktuellForslagSchema>
