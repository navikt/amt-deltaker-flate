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

export const kodeverkResponseSchema = z.object({
  tiltakskode: z.string(),
  alternativer: z.array(
    z.union([
      kodeverkGruppeSchema,
      kodeverkVerdigruppeSchema,
      kodeverkVerdigruppeSokSchema
    ])
  )
})

export type KodeverkResponse = z.infer<typeof kodeverkResponseSchema>

/**
 * Henter alle valgte verdi-IDer fra kodeverket rekursivt.
 */
export const getValgteVerdier = (
  alternativer: KodeverkContainer[]
): string[] => {
  return alternativer.flatMap((a) => {
    if (a.type === KodeverkAlternativType.VERDIGRUPPE) {
      return a.alternativer.filter((v) => v.valgt).map((v) => v.id)
    }
    if (a.type === KodeverkAlternativType.GRUPPE) {
      return getValgteVerdier(a.alternativer)
    }
    return []
  })
}

/**
 * Finner IDen til det første alternativet i en Gruppe som inneholder valgte verdier.
 */
export const finnAlternativMedValgteVerdier = (
  gruppe: KodeverkGruppe
): string | null => {
  for (const a of gruppe.alternativer) {
    if (
      a.type === KodeverkAlternativType.VERDIGRUPPE &&
      a.alternativer.some((v) => v.valgt)
    ) {
      return a.id ?? a.visningsnavn
    }
    if (a.type === KodeverkAlternativType.GRUPPE) {
      const harValgte = getValgteVerdier(a.alternativer).length > 0
      if (harValgte) return a.id ?? a.visningsnavn
    }
  }
  return null
}
