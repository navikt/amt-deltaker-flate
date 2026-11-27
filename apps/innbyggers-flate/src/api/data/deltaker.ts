import {
  deltakelsesinnholdSchema,
  deltakelsesmengderSchema,
  deltakerlisteSchema,
  forslagSchema,
  importertDeltakerFraArenaSchema,
  pameldingStatusSchema,
  vedtaksinformasjonSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

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

export type DeltakerResponse = z.infer<typeof deltakerSchema>
