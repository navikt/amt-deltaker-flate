import {
  deltakelsesinnholdSchema,
  deltakelsesmengderSchema,
  forslagSchema,
  importertDeltakerFraArenaSchema,
  pameldingStatusSchema,
  arenaTiltakstypeSchema,
  vedtaksinformasjonSchema,
  Oppstartstype,
  dateSchema,
  nullableDateSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.uuid(),
  deltakerlisteNavn: z.string(),
  tiltakstype: arenaTiltakstypeSchema,
  arrangorNavn: z.string(),
  oppstartstype: z.enum(Oppstartstype),
  startdato: dateSchema,
  sluttdato: nullableDateSchema
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
