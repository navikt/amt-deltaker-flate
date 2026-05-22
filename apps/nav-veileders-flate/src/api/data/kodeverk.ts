import { z } from 'zod'

export enum KodeverkAlternativType {
  GRUPPE = 'Gruppe',
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

export const kodeverkVerdigruppeSchema = z.object({
  type: z.literal(KodeverkAlternativType.VERDIGRUPPE),
  id: z.uuid().nullable(),
  visningsnavn: z.string(),
  representerer: z.string().nullable(),
  seleksjonstype: z.enum(Seleksjonstype),
  alternativer: z.array(kodeverkVerdiSchema)
})

export type KodeverkVerdigruppe = z.infer<typeof kodeverkVerdigruppeSchema>

export const kodeverkVerdigruppeSokSchema = z.object({
  type: z.literal(KodeverkAlternativType.VERDIGRUPPE_SOK),
  id: z.uuid().nullable(),
  visningsnavn: z.string(),
  representerer: z.string().nullable(),
  seleksjonstype: z.enum(Seleksjonstype),
  kilde: z.enum(VerdigruppeSokKilde)
})

export type KodeverkVerdigruppeSok = z.infer<
  typeof kodeverkVerdigruppeSokSchema
>

export const kodeverkGruppeSchema = z.object({
  type: z.literal(KodeverkAlternativType.GRUPPE),
  id: z.uuid().nullable(),
  visningsnavn: z.string(),
  get alternativer() {
    return z.array(
      z.union([
        kodeverkVerdigruppeSchema,
        kodeverkVerdigruppeSokSchema,
        kodeverkGruppeSchema
      ])
    )
  }
})

export type KodeverkGruppe = z.infer<typeof kodeverkGruppeSchema>

export type KodeverkContainer =
  | KodeverkGruppe
  | KodeverkVerdigruppe
  | KodeverkVerdigruppeSok

const sertifiseringValgSchema = z.array(
  z.object({
    id: z.int(),
    navn: z.string()
  })
)

export const kodeverkResponseSchema = z.object({
  tiltakskode: z.string(),
  alternativer: z.array(
    z.union([
      kodeverkGruppeSchema,
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

export const utflatetKodeverkSchema = z.object({
  tittel: z.string().nullable(),
  valg: z.array(z.string()),
  valgteKodeverkIder: z.array(z.uuid()), // TODO dette kan fjernes hvis meld på direkte kan sende med tom request fra utkast
  valgteSertifiseringer: sertifiseringValgSchema // TODO dette kan fjernes hvis meld på direkte kan sende med tom request fra utkast
})

export type FlattKodeverk = z.infer<typeof utflatetKodeverkSchema>
