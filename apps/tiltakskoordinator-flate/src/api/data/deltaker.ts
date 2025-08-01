import {
  deltakerStatusAarsakSchema,
  deltakerStatusTypeSchema,
  forslagSchema,
  nullableDateSchema,
  Tiltakskode,
  vurderingstypeSchema
} from 'deltaker-flate-common'
import { z } from 'zod'
import { Beskyttelsesmarkering } from './deltakerliste.ts'

export const navVeilederSchema = z.object({
  navn: z.string().nullable(),
  telefonnummer: z.string().nullable(),
  epost: z.string().nullable()
})

export const deltakerStatusSchema = z.object({
  type: deltakerStatusTypeSchema,
  aarsak: deltakerStatusAarsakSchema.nullable()
})

const vurderingSchema = z.object({
  type: vurderingstypeSchema,
  begrunnelse: z.string().nullable()
})

export enum InnsatsbehovType {
  STANDARD_INNSATS = 'STANDARD_INNSATS',
  SITUASJONSBESTEMT_INNSATS = 'SITUASJONSBESTEMT_INNSATS',
  SPESIELT_TILPASSET_INNSATS = 'SPESIELT_TILPASSET_INNSATS',
  VARIG_TILPASSET_INNSATS = 'VARIG_TILPASSET_INNSATS',
  GRADERT_VARIG_TILPASSET_INNSATS = 'GRADERT_VARIG_TILPASSET_INNSATS'
}

export const deltakerDetaljerSchema = z.object({
  id: z.string().uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  fodselsnummer: z.string().nullable(),
  status: deltakerStatusSchema,
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  navEnhet: z.string().nullable(),
  navVeileder: navVeilederSchema.nullable(),
  beskyttelsesmarkering: z.array(z.enum(Beskyttelsesmarkering)),
  vurdering: vurderingSchema.nullable(),
  innsatsgruppe: z.enum(InnsatsbehovType).nullable(),
  tiltakskode: z.enum(Tiltakskode),
  tilgangTilBruker: z.boolean(),
  aktiveForslag: z.array(forslagSchema)
})

export type DeltakerDetaljer = z.infer<typeof deltakerDetaljerSchema>
export type Vurdering = z.infer<typeof vurderingSchema>
