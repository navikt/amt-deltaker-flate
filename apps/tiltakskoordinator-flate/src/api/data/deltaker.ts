import { z } from 'zod'
import {
  deltakerStatusAarsakSchema,
  deltakerStatusTypeSchema,
  vurderingstypeSchema
} from 'deltaker-flate-common'
import { beskyttelsesmarkeringSchema } from './deltakerliste.ts'

export const kontaktInfomasjonSchema = z.object({
  telefonnummer: z.string().nullable(),
  epost: z.string().nullable(),
  adresse: z.string().nullable()
})

export const navVeilederSchema = z.object({
  navn: z.string(),
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

const innsatsbehovSchema = z.nativeEnum(InnsatsbehovType)

export const deltakerDetaljerSchema = z.object({
  id: z.string().uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  fodselsnummer: z.string(),
  status: deltakerStatusSchema,
  startdato: z.string().nullable(),
  sluttdato: z.string().nullable(),
  kontaktinformasjon: kontaktInfomasjonSchema,
  navEnhet: z.string().nullable(),
  navVeileder: navVeilederSchema.nullable(),
  beskyttelsesmarkering: z.array(beskyttelsesmarkeringSchema),
  vurdering: vurderingSchema.nullable(),
  innsatsgruppe: innsatsbehovSchema
})

export type DeltakerDetaljer = z.infer<typeof deltakerDetaljerSchema>
export type Vurdering = z.infer<typeof vurderingSchema>
