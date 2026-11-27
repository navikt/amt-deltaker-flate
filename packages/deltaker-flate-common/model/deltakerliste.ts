import { z } from 'zod'
import {
  DeltakerlisteStatus,
  Oppstartstype,
  Pameldingstype,
  tiltakskodeResponseSchema
} from './deltaker'
import { opplaringKategoriseringSchema } from './kodeverk'
import { prisinformasjonSchema } from './prisinformasjon'
import { nullableDateSchema } from './utils'

export const deltakerlisteStatusSchema = z.enum(DeltakerlisteStatus)

export const innholdselementSchema = z.object({
  tekst: z.string(),
  innholdskode: z.string()
})

const tilgjengeligInnholdSchema = z.object({
  ledetekst: z.string().nullable(),
  innhold: z.array(innholdselementSchema)
})

export const visningsnavnSchema = z.object({
  tiltakHosArrangorTittel: z.string(),
  tiltakHosArrangorIngressTekst: z.string(),
  kladdTiltakHosArrangorTittel: z.string()
})

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.uuid(),
  deltakerlisteNavn: z.string(),
  tiltakskode: tiltakskodeResponseSchema,
  arrangor: z
    .object({
      navn: z.string(),
      organisasjonsnummer: z.string()
    })
    .nullish(),
  oppstartstype: z.enum(Oppstartstype).nullable(),
  startdato: nullableDateSchema,
  sluttdato: nullableDateSchema,
  status: deltakerlisteStatusSchema.nullable(),
  tilgjengeligInnhold: tilgjengeligInnholdSchema,
  erEnkeltplass: z.boolean(),
  oppmoteSted: z.string().nullable(),
  pameldingstype: z.enum(Pameldingstype),
  opplaringKategoriseringValg: opplaringKategoriseringSchema.nullable(),
  visningsnavn: visningsnavnSchema,
  prisinformasjon: prisinformasjonSchema.nullish(),
  prisinformasjonTilGodkjenning: prisinformasjonSchema.nullish()
})

export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
