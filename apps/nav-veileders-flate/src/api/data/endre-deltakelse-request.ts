import { z } from 'zod'
import { DeltakerStatusAarsakType } from 'deltaker-flate-common'
import { innholdDtoSchema } from './send-inn-pamelding-request'

export enum Endringstype {
  IKKE_AKTUELL = 'IKKE_AKTUELL',
  FORLENG_DELTAKELSE = 'FORLENG_DELTAKELSE',
  ENDRE_STARTDATO = 'ENDRE_STARTDATO',
  ENDRE_BAKGRUNNSINFO = 'ENDRE_BAKGRUNNSINFO',
  AVSLUTT_DELTAKELSE = 'AVSLUTT_DELTAKELSE',
  ENDRE_SLUTTARSAK = 'ENDRE_SLUTTARSAK',
  ENDRE_INNHOLD = 'ENDRE_INNHOLD',
  ENDRE_DELTAKELSESMENGDE = 'ENDRE_DELTAKELSESMENGDE',
  REAKTIVER_DELTAKELSE = 'REAKTIVER_DELTAKELSE',
  ENDRE_AVSLUTNING = 'ENDRE_AVSLUTNING',
  FJERN_OPPSTARTSDATO = 'FJERN_OPPSTARTSDATO'
}

export const aarsakSchema = z.object({
  type: z.enum(DeltakerStatusAarsakType),
  beskrivelse: z.string().nullable()
})

export const ikkeAktuellSchema = z.object({
  endringstype: z.literal(Endringstype.IKKE_AKTUELL),
  aarsak: aarsakSchema,
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})
export type IkkeAktuellRequest = z.infer<typeof ikkeAktuellSchema>

export const forlengDeltakelseSchema = z.object({
  endringstype: z.literal(Endringstype.FORLENG_DELTAKELSE),
  sluttdato: z.string(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})
export type ForlengDeltakelseRequest = z.infer<typeof forlengDeltakelseSchema>

export const fjernOppstartsdatoSchema = z.object({
  endringstype: z.literal(Endringstype.FJERN_OPPSTARTSDATO),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})
export type FjernOppstartsdatoRequest = z.infer<typeof fjernOppstartsdatoSchema>

export const endreStartdatoSchema = z.object({
  endringstype: z.literal(Endringstype.ENDRE_STARTDATO),
  startdato: z.string().nullable(),
  sluttdato: z.string().nullable(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullish()
})
export type EndreStartdatoRequest = z.infer<typeof endreStartdatoSchema>

export const endreBakgrunnsinfoSchema = z.object({
  endringstype: z.literal(Endringstype.ENDRE_BAKGRUNNSINFO),
  bakgrunnsinformasjon: z.string().nullable()
})
export type EndreBakgrunnsinfoRequest = z.infer<typeof endreBakgrunnsinfoSchema>

export const avsluttDeltakelseSchema = z.object({
  endringstype: z.literal(Endringstype.AVSLUTT_DELTAKELSE),
  aarsak: aarsakSchema.nullable(),
  sluttdato: z.string().nullable(),
  harDeltatt: z.boolean().nullable(),
  harFullfort: z.boolean().nullable(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})
export type AvsluttDeltakelseRequest = z.infer<typeof avsluttDeltakelseSchema>

export const endreAvslutningSchema = z.object({
  endringstype: z.literal(Endringstype.ENDRE_AVSLUTNING),
  aarsak: aarsakSchema.nullable(),
  harDeltatt: z.boolean().nullable(),
  harFullfort: z.boolean().nullable(),
  sluttdato: z.string().nullable(),
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullable()
})
export type EndreAvslutningRequest = z.infer<typeof endreAvslutningSchema>

export const endreSluttarsakSchema = z.object({
  endringstype: z.literal(Endringstype.ENDRE_SLUTTARSAK),
  aarsak: aarsakSchema,
  begrunnelse: z.string().nullable(),
  forslagId: z.uuid().nullish()
})
export type EndreSluttarsakRequest = z.infer<typeof endreSluttarsakSchema>

export const endreInnholdSchema = z.object({
  endringstype: z.literal(Endringstype.ENDRE_INNHOLD),
  innhold: z.array(innholdDtoSchema)
})
export type EndreInnholdRequest = z.infer<typeof endreInnholdSchema>

export const endreDeltakelsesmengdeSchema = z.object({
  endringstype: z.literal(Endringstype.ENDRE_DELTAKELSESMENGDE),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional(),
  gyldigFra: z.string(),
  begrunnelse: z.string().nullable(),
  forslagId: z.string().nullable()
})
export type EndreDeltakelsesmengdeRequest = z.infer<
  typeof endreDeltakelsesmengdeSchema
>

export const avvisForslagSchema = z.object({
  begrunnelse: z.string()
})

export type AvvisForslagRequest = z.infer<typeof avvisForslagSchema>

export const reaktiverDeltakelseSchema = z.object({
  endringstype: z.literal(Endringstype.REAKTIVER_DELTAKELSE),
  begrunnelse: z.string()
})
export type ReaktiverDeltakelseRequest = z.infer<
  typeof reaktiverDeltakelseSchema
>

export type EndringRequest =
  | IkkeAktuellRequest
  | ForlengDeltakelseRequest
  | EndreStartdatoRequest
  | EndreBakgrunnsinfoRequest
  | AvsluttDeltakelseRequest
  | EndreSluttarsakRequest
  | EndreInnholdRequest
  | EndreDeltakelsesmengdeRequest
  | ReaktiverDeltakelseRequest
  | EndreAvslutningRequest
  | FjernOppstartsdatoRequest

export type KanEndresUtenAktivOppfolging =
  | AvsluttDeltakelseRequest
  | EndreAvslutningRequest
  | EndreSluttarsakRequest
  | IkkeAktuellRequest

export const kanEndresUtenAktivOppfolging = (body: EndringRequest): boolean =>
  body.endringstype === Endringstype.AVSLUTT_DELTAKELSE ||
  body.endringstype === Endringstype.ENDRE_AVSLUTNING ||
  body.endringstype === Endringstype.ENDRE_SLUTTARSAK ||
  body.endringstype === Endringstype.IKKE_AKTUELL

export const isKanEndresUtenAktivOppfolging = (
  body: EndringRequest
): body is KanEndresUtenAktivOppfolging => kanEndresUtenAktivOppfolging(body)
