import {
  nullableDateSchema,
  pameldingStatusSchema,
  tiltakstypeSchema
} from 'deltaker-flate-common'
import { z } from 'zod'

export const deltakerSchema = z.object({
  deltakerId: z.string().uuid(),
  navn: z.string(),
  status: pameldingStatusSchema
})

export const deltakereSchema = z.array(deltakerSchema)

export const deltakerlisteDetaljerSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  tiltakstype: tiltakstypeSchema,
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema
})

export type Deltaker = z.infer<typeof deltakerSchema>
export type Deltakere = z.infer<typeof deltakereSchema>
export type DeltakerlisteDetaljer = z.infer<typeof deltakerlisteDetaljerSchema>
