import {
  forslagSchema,
  deltakelsesinnholdSchema,
  deltakerStaturTypeSchema,
  deltakerStatusAarsakSchema,
  tiltakstypeSchema,
  vedtaksinformasjonSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  deltakerlisteNavn: z.string(),
  tiltakstype: tiltakstypeSchema,
  arrangorNavn: z.string(),
  oppstartstype: z.string(),
  startdato: z.string(),
  sluttdato: z.string().nullable()
})

export const pameldingStatusSchema = z.object({
  id: z.string().uuid(),
  type: deltakerStaturTypeSchema,
  aarsak: deltakerStatusAarsakSchema.nullable(),
  gyldigFra: z.string(),
  gyldigTil: z.string().nullable(),
  opprettet: z.string()
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
  forslag: z.array(forslagSchema)
})

export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type DeltakerResponse = z.infer<typeof deltakerSchema>
