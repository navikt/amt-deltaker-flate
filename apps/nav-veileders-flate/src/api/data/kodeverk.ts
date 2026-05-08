import { z } from 'zod'

export enum KodeverkAlternativType {
  GRUPPE = 'Gruppe',
  VERDIGRUPPE = 'Verdigruppe',
  VERDIGRUPPE_SOK = 'VerdigruppeSok',
  VERDI = 'Verdi'
}

export enum Seleksjonstype {
  ENKELTVALG = 'ENKELTVALG',
  FLERVALG = 'FLERVALG'
}

export enum VerdigruppeSokKilde {
  JANZZ_SERTIFISERING = 'JANZZ_SERTIFISERING'
}

export const kodeverkVerdiSchema = z.object({
  type: z.literal(KodeverkAlternativType.VERDI),
  id: z.uuid(),
  visningsnavn: z.string(),
  valgt: z.boolean()
})

export const kodeverkVerdigruppeSchema = z.object({
  type: z.literal(KodeverkAlternativType.VERDIGRUPPE),
  id: z.uuid(),
  visningsnavn: z.string(),
  representerer: z.string(),
  seleksjonstype: z.enum(Seleksjonstype),
  alternativer: z.array(kodeverkVerdiSchema)
})

export type KodeverkVerdigruppe = z.infer<typeof kodeverkVerdigruppeSchema>

export const kodeverkVerdigruppeSokSchema = z.object({
  type: z.literal(KodeverkAlternativType.VERDIGRUPPE_SOK),
  id: z.uuid(),
  visningsnavn: z.string(),
  representerer: z.string(),
  seleksjonstype: z.enum(Seleksjonstype),
  kilde: z.enum(VerdigruppeSokKilde)
})

export type KodeverkVerdigruppeSok = z.infer<
  typeof kodeverkVerdigruppeSokSchema
>

export const kodeverkGruppeSchema = z.object({
  type: z.literal(KodeverkAlternativType.GRUPPE),
  id: z.uuid(),
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

export const kodeverkResponseSchema = z.object({
  tiltakskode: z.string(),
  kategorier: z.array(
    z.union([
      kodeverkGruppeSchema,
      kodeverkVerdigruppeSchema,
      kodeverkVerdigruppeSokSchema
    ])
  )
})

export type KodeverkResponse = z.infer<typeof kodeverkResponseSchema>
