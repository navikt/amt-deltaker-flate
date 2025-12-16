import {
  Tiltakskode,
  deltakelsesinnholdSchema,
  deltakelsesmengderSchema,
  DeltakerlisteStatus,
  forslagSchema,
  importertDeltakerFraArenaSchema,
  nullableDateSchema,
  Oppstartstype,
  pameldingStatusSchema,
  vedtaksinformasjonSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

export const deltakerlisteStatusSchema = z.enum(DeltakerlisteStatus)

export const innholdselementSchema = z.object({
  tekst: z.string(),
  innholdskode: z.string()
})

const tilgjengeligInnholdSchema = z.object({
  ledetekst: z.string().nullable(),
  innhold: z.array(innholdselementSchema)
})

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.uuid(),
  deltakerlisteNavn: z.string(),
  tiltakskode: z.enum(Tiltakskode),
  arrangorNavn: z.string(),
  oppstartstype: z.enum(Oppstartstype).nullable(),
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  status: deltakerlisteStatusSchema.nullable(),
  tilgjengeligInnhold: tilgjengeligInnholdSchema,
  erEnkeltplassUtenRammeavtale: z.boolean(),
  oppmoteSted: z.string().nullable(),
  kreverGodkjenning: z.boolean() // direktegodkjent ?? TODO bestemme oss for navn
})

export const pameldingSchema = z.object({
  deltakerId: z.uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  deltakerliste: deltakerlisteSchema,
  status: pameldingStatusSchema,
  startdato: z.string().nullable(),
  sluttdato: z.string().nullable(),
  dagerPerUke: z.number().nullable(),
  deltakelsesprosent: z.number().nullable(),
  bakgrunnsinformasjon: z.string().nullable(),
  deltakelsesinnhold: deltakelsesinnholdSchema.nullable(),
  vedtaksinformasjon: vedtaksinformasjonSchema.nullable(),
  adresseDelesMedArrangor: z.boolean(),
  kanEndres: z.boolean(),
  digitalBruker: z.boolean(),
  harAdresse: z.boolean(),
  maxVarighet: z.number().nullable(),
  softMaxVarighet: z.number().nullable(),
  forslag: z.array(forslagSchema),
  importertFraArena: importertDeltakerFraArenaSchema.nullable(),
  erUnderOppfolging: z.boolean(),
  deltakelsesmengder: deltakelsesmengderSchema,
  erManueltDeltMedArrangor: z.boolean()
})

export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type PameldingResponse = z.infer<typeof pameldingSchema>
export type Deltakelsesinnhold = z.infer<typeof deltakelsesinnholdSchema>
export type Innholdselement = z.infer<typeof innholdselementSchema>
