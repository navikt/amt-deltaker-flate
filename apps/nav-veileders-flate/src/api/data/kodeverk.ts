import { z } from 'zod'
import {
  OpplaringRepresenterer,
  sertifiseringValgSchema,
  Tiltakskode
} from 'deltaker-flate-common'

// Re-eksporter det flate kodeverket fra fellespakken slik at eksisterende
// imports fra denne fila fortsatt fungerer (FlattKodeverk, utflatetKodeverkSchema).
export {
  opplaringKategoriseringSchema,
  type OpplaringKategorisering
} from 'deltaker-flate-common'

export enum KodeverkAlternativType {
  UTDANNING_GRUPPE = 'UtdanningGruppe',
  VERDIGRUPPE = 'Verdigruppe',
  VERDIGRUPPE_SOK = 'VerdigruppeSok'
}

export enum Seleksjonstype {
  ENKELTVALG = 'ENKELTVALG',
  FLERVALG = 'FLERVALG'
}

export enum VerdigruppeSokKilde {
  JANZZ_SERTIFISERING = 'JANZZ_SERTIFISERING'
}

export const kodeverkVerdiSchema = z.object({
  id: z.uuid(),
  visningsnavn: z.string(),
  valgt: z.boolean().default(false)
})

const kodeverkVerdigruppeBaseSchema = z.object({
  visningsnavn: z.string(),
  pakrevd: z.boolean().default(false),
  representerer: z.enum(OpplaringRepresenterer),
  seleksjonstype: z.enum(Seleksjonstype),
  alternativer: z.array(kodeverkVerdiSchema)
})

export type KodeverkVerdigruppeBase = z.infer<
  typeof kodeverkVerdigruppeBaseSchema
>

export const kodeverkVerdigruppeSchema = kodeverkVerdigruppeBaseSchema.extend({
  type: z.literal(KodeverkAlternativType.VERDIGRUPPE)
})

export type KodeverkVerdigruppe = z.infer<typeof kodeverkVerdigruppeSchema>

export const kodeverkVerdigruppeSokSchema = z.object({
  type: z.literal(KodeverkAlternativType.VERDIGRUPPE_SOK),
  visningsnavn: z.string(),
  pakrevd: z.boolean().default(false),
  representerer: z.enum(OpplaringRepresenterer).nullable(),
  seleksjonstype: z.enum(Seleksjonstype),
  kilde: z.enum(VerdigruppeSokKilde)
})

export type KodeverkVerdigruppeSok = z.infer<
  typeof kodeverkVerdigruppeSokSchema
>

export const kodeverkUtdanningValgSchema = z.object({
  id: z.uuid(),
  visningsnavn: z.string(),
  larefag: kodeverkVerdigruppeBaseSchema,
  valgt: z.boolean()
})

export const kodeverkUtdanningGruppeSchema = z.object({
  type: z.literal(KodeverkAlternativType.UTDANNING_GRUPPE),
  visningsnavn: z.string(),
  representerer: z.enum(OpplaringRepresenterer),
  pakrevd: z.boolean().default(false),
  utdanninger: z.array(kodeverkUtdanningValgSchema)
})

export type KodeverkUtdanningGruppe = z.infer<
  typeof kodeverkUtdanningGruppeSchema
>

export type KodeverkContainer =
  | KodeverkUtdanningGruppe
  | KodeverkVerdigruppe
  | KodeverkVerdigruppeSok

/*
  Tilgjengelige kodeverk for tiltakstype med informasjon om de er valgt eller ikke
 */
export const kodeverkResponseSchema = z.object({
  tiltakskode: z.enum(Tiltakskode),
  alternativer: z.array(
    z.union([
      kodeverkUtdanningGruppeSchema,
      kodeverkVerdigruppeSchema,
      kodeverkVerdigruppeSokSchema
    ])
  ),
  sertifiseringValg: sertifiseringValgSchema
})

export type KodeverkResponse = z.infer<typeof kodeverkResponseSchema>

export const kodeverkSertifiseringResponseSchema = z.array(
  z.object({
    konseptId: z.int(),
    label: z.string()
  })
)

export type KodeverkSertifiseringResponse = z.infer<
  typeof kodeverkSertifiseringResponseSchema
>
