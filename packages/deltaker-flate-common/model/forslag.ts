import { z } from 'zod'
import { stringToDate } from './deltaker'

export enum HistorikkType {
  Vedtak = 'Vedtak',
  Endring = 'Endring',
  Forslag = 'Forslag',
  EndringFraArrangor = 'EndringFraArrangor'
}

export enum ForslagStatusType {
  VenterPaSvar = 'VenterPaSvar',
  Avvist = 'Avvist',
  Tilbakekalt = 'Tilbakekalt',
  Erstattet = 'Erstattet',
  Godkjent = 'Godkjent'
}

export enum ForslagEndringType {
  ForlengDeltakelse = 'ForlengDeltakelse',
  AvsluttDeltakelse = 'AvsluttDeltakelse',
  IkkeAktuell = 'IkkeAktuell',
  Deltakelsesmengde = 'Deltakelsesmengde',
  Sluttdato = 'Sluttdato',
  Startdato = 'Startdato',
  Sluttarsak = 'Sluttarsak'
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
  sluttdato: stringToDate
})

export const avsluttDeltakelseForslagSchema = z.object({
  type: z.literal(ForslagEndringType.AvsluttDeltakelse),
  sluttdato: stringToDate,
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

export const sluttdatoForslagSchema = z.object({
  type: z.literal(ForslagEndringType.Sluttdato),
  sluttdato: stringToDate
})

export const startdatoForslagSchema = z.object({
  type: z.literal(ForslagEndringType.Startdato),
  startdato: stringToDate,
  sluttdato: stringToDate.nullable()
})

export const sluttarsakForslagSchema = z.object({
  type: z.literal(ForslagEndringType.Sluttarsak),
  aarsak: forslagEndringAarsakSchema
})

export const forslagEndringSchema = z.discriminatedUnion('type', [
  forlengDeltakelseForslagSchema,
  avsluttDeltakelseForslagSchema,
  ikkeAktuellForslagSchema,
  deltakelsesmengdeForslagSchema,
  sluttdatoForslagSchema,
  startdatoForslagSchema,
  sluttarsakForslagSchema
])

const venterPaSvarSchema = z.object({
  type: z.literal(ForslagStatusType.VenterPaSvar)
})
const godkjentSchema = z.object({
  type: z.literal(ForslagStatusType.Godkjent),
  godkjent: stringToDate
})
const avvistSchema = z.object({
  type: z.literal(ForslagStatusType.Avvist),
  avvistAv: z.string(),
  avvistAvEnhet: z.string(),
  avvist: stringToDate,
  begrunnelseFraNav: z.string()
})
const tilbakekaltSchema = z.object({
  type: z.literal(ForslagStatusType.Tilbakekalt),
  tilbakekalt: stringToDate
})
const erstattetSchema = z.object({
  type: z.literal(ForslagStatusType.Erstattet),
  erstattet: stringToDate
})

const forslagStatusSchema = z.discriminatedUnion('type', [
  venterPaSvarSchema,
  godkjentSchema,
  avvistSchema,
  tilbakekaltSchema,
  erstattetSchema
])

export const forslagSchema = z.object({
  id: z.string().uuid(),
  type: z.literal(HistorikkType.Forslag),
  opprettet: stringToDate,
  begrunnelse: z.string().nullable(),
  arrangorNavn: z.string(),
  endring: forslagEndringSchema,
  status: forslagStatusSchema
})

export type Forslag = z.infer<typeof forslagSchema>
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
export type SluttdatoForslag = z.infer<typeof sluttdatoForslagSchema>
export type StartdatoForslag = z.infer<typeof startdatoForslagSchema>
export type SluttarsakForslag = z.infer<typeof sluttarsakForslagSchema>
