import { z } from 'zod'

export enum ForslagStatusType {
  VenterPaSvar = 'VenterPaSvar'
}

export enum ForslagEndringType {
  ForlengDeltakelse = 'ForlengDeltakelse',
  AvsluttDeltakelse = 'AvsluttDeltakelse',
  IkkeAktuell = 'IkkeAktuell',
  Deltakelsesmengde = 'Deltakelsesmengde'
}

export enum ForslagEndringAarsakType {
  Syk = 'Syk',
  FattJobb = 'FattJobb',
  TrengerAnnenStotte = 'TrengerAnnenStotte',
  Utdanning = 'Utdanning',
  IkkeMott = 'IkkeMott',
  Annet = 'Annet'
}

const Syk = z.object({ type: z.literal(ForslagEndringAarsakType.Syk) })
const FattJobb = z.object({
  type: z.literal(ForslagEndringAarsakType.FattJobb)
})
const TrengerAnnenStotte = z.object({
  type: z.literal(ForslagEndringAarsakType.TrengerAnnenStotte)
})
const Utdanning = z.object({
  type: z.literal(ForslagEndringAarsakType.Utdanning)
})
const IkkeMott = z.object({
  type: z.literal(ForslagEndringAarsakType.IkkeMott)
})
const Annet = z.object({
  type: z.literal(ForslagEndringAarsakType.Annet),
  beskrivelse: z.string()
})

const forslagEndringAarsakSchema = z.discriminatedUnion('type', [
  Syk,
  FattJobb,
  TrengerAnnenStotte,
  Utdanning,
  IkkeMott,
  Annet
])

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

const deltakelsesmengdeForslagSchema = z.object({
  type: z.literal(ForslagEndringType.Deltakelsesmengde),
  deltakelsesprosent: z.number(),
  dagerPerUke: z.number().nullable()
})

export const forslagEndringSchema = z.discriminatedUnion('type', [
  forlengDeltakelseForslagSchema,
  avsluttDeltakelseForslagSchema,
  ikkeAktuellForslagSchema,
  deltakelsesmengdeForslagSchema
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
export type DeltakelsesmengdeForslag = z.infer<
  typeof deltakelsesmengdeForslagSchema
>
