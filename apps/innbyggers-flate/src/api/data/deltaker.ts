import {
  deltakelsesinnholdSchema,
  deltakelsesmengderSchema,
  forslagSchema,
  importertDeltakerFraArenaSchema,
  nullableDateSchema,
  opplaringKategoriseringSchema,
  Oppstartstype,
  pameldingStatusSchema,
  Pameldingstype,
  prisinformasjonSchema,
  Tiltakskode,
  tiltakskodeResponseSchema,
  vedtaksinformasjonSchema,
  visningsnavnSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.uuid(),
  deltakerlisteNavn: z.string(),
  tiltakskode: z.enum(Tiltakskode),
  tiltakskodeResponse: tiltakskodeResponseSchema,
  arrangorNavn: z.string(),
  oppstartstype: z.enum(Oppstartstype).nullable(),
  pameldingstype: z.enum(Pameldingstype),
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  erEnkeltplass: z.boolean(),
  oppmoteSted: z.string().nullable(),
  opplaringKategoriseringValg: opplaringKategoriseringSchema.nullable(),
  prisinformasjon: prisinformasjonSchema.nullish(),
  visningsnavn: visningsnavnSchema
})

export const deltakerSchema = z.object({
  deltakerId: z.uuid(),
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
  forslag: z.array(forslagSchema),
  importertFraArena: importertDeltakerFraArenaSchema.nullable(),
  deltakelsesmengder: deltakelsesmengderSchema,
  erManueltDeltMedArrangor: z.boolean()
})

export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type DeltakerResponse = z.infer<typeof deltakerSchema>
