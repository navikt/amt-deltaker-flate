import {
  deltakelsesinnholdSchema,
  deltakelsesmengderSchema,
  deltakerlisteSchema,
  forslagSchema,
  importertDeltakerFraArenaSchema,
  nullableDateSchema,
  pameldingStatusSchema,
  vedtaksinformasjonSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

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
  erManueltDeltMedArrangor: z.boolean()
})

export type DeltakerResponse = z.infer<typeof deltakerSchema>
