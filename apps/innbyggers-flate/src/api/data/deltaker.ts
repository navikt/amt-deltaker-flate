import {
  deltakelsesinnholdSchema,
  deltakelsesmengderSchema,
  forslagSchema,
  importertDeltakerFraArenaSchema,
  pameldingStatusSchema,
  arenaTiltakstypeSchema,
  vedtaksinformasjonSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  deltakerlisteNavn: z.string(),
  tiltakstype: arenaTiltakstypeSchema,
  arrangorNavn: z.string(),
  oppstartstype: z.string(),
  startdato: z.string(), // har format "YYYY-MM-DD"
  sluttdato: z.string().nullable() // har format "YYYY-MM-DD"
})

export const deltakerSchema = z.object({
  deltakerId: z.string().uuid(),
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
  deltakelsesmengder: deltakelsesmengderSchema
})

export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type DeltakerResponse = z.infer<typeof deltakerSchema>
