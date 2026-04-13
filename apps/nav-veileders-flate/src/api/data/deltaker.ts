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
  vedtaksinformasjonSchema,
  Pameldingstype
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
  arrangor: z
    .object({
      navn: z.string(),
      organisasjonsnummer: z.string()
    })
    .nullable(),
  oppstartstype: z.enum(Oppstartstype).nullable(),
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  status: deltakerlisteStatusSchema.nullable(),
  tilgjengeligInnhold: tilgjengeligInnholdSchema,
  erEnkeltplass: z.boolean(),
  oppmoteSted: z.string().nullable(),
  pameldingstype: z.enum(Pameldingstype)
})

export const deltakerSchema = z.object({
  deltakerId: z.uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  deltakerliste: deltakerlisteSchema,
  status: pameldingStatusSchema,
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
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
  erManueltDeltMedArrangor: z.boolean(),
  prisinformasjon: z.string().nullable()
})

export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type DeltakerResponse = z.infer<typeof deltakerSchema>
