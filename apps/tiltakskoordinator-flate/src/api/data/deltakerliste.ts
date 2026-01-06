import {
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  nullableDateSchema,
  Oppstartstype,
  Tiltakskode,
  Vurderingstype
} from 'deltaker-flate-common'
import { z } from 'zod'

export enum Beskyttelsesmarkering {
  FORTROLIG = 'FORTROLIG',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
  SKJERMET = 'SKJERMET'
}

const deltakerStatusAarsakSchema = z.object({
  type: z.enum(DeltakerStatusAarsakType)
})

export const deltakerStatusSchema = z.object({
  type: z.enum(DeltakerStatusType),
  aarsak: deltakerStatusAarsakSchema.nullable()
})

export enum Feilkode {
  UGYLDIG_STATE = 'UGYLDIG_STATE',
  MIDLERTIDIG_FEIL = 'MIDLERTIDIG_FEIL',
  UKJENT = 'UKJENT'
}

export const deltakerSchema = z.object({
  id: z.uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  status: deltakerStatusSchema,
  vurdering: z.enum(Vurderingstype).nullable(),
  beskyttelsesmarkering: z.array(z.enum(Beskyttelsesmarkering)),
  navEnhet: z.string().nullable(),
  erManueltDeltMedArrangor: z.boolean(),
  feilkode: z.enum(Feilkode).nullable().optional(),
  ikkeDigitalOgManglerAdresse: z.boolean(),
  harAktiveForslag: z.boolean(),
  erNyDeltaker: z.boolean(),
  harOppdateringFraNav: z.boolean(),
  kanEndres: z.boolean(),
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema
})

export const deltakereSchema = z.array(deltakerSchema)

const koordinatorSchema = z.object({
  id: z.uuid(),
  navn: z.string(),
  erAktiv: z.boolean(),
  kanFjernes: z.boolean()
})

export const deltakerlisteDetaljerSchema = z.object({
  id: z.uuid(),
  navn: z.string(),
  tiltakskode: z.enum(Tiltakskode),
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  oppstartstype: z.enum(Oppstartstype).nullable(),
  apentForPamelding: z.boolean(),
  antallPlasser: z.number().nullable(),
  // TODO legge til pameldingstype
  koordinatorer: z.array(koordinatorSchema)
})

export type Deltaker = z.infer<typeof deltakerSchema>
export type Deltakere = z.infer<typeof deltakereSchema>
export type DeltakerlisteDetaljer = z.infer<typeof deltakerlisteDetaljerSchema>
export type Koordinator = z.infer<typeof koordinatorSchema>
