import { z } from 'zod'

export enum KodeverkAlternativType {
  GRUPPE = 'GRUPPE',
  VERDIGRUPPE = 'VERDIGRUPPE',
  VERDI = 'VERDI'
}
export enum Seleksjonstype {
  ENKELTVALG = 'ENKELTVALG',
  FLERVALG = 'FLERVALG'
}

export const kodeverkVerdiSchema = z.object({
  type: z.literal('Verdi'),
  id: z.uuid(),
  visningsnavn: z.string(),
  valgt: z.boolean()
})

export type KodeverkVerdi = z.infer<typeof kodeverkVerdiSchema>

export const kodeverkVerdigruppeSchema = z.object({
  type: z.literal(KodeverkAlternativType.VERDIGRUPPE),
  id: z.uuid(),
  visningsnavn: z.string(),
  seleksjonstype: z.enum(Seleksjonstype),
  alternativer: z.array(kodeverkVerdiSchema)
})

export type KodeverkVerdigruppe = z.infer<typeof kodeverkVerdigruppeSchema>

export const kodeverkGruppeSchema: z.ZodType = z.object({
  type: z.literal(KodeverkAlternativType.GRUPPE),
  id: z.uuid(),
  visningsnavn: z.string(),
  alternativer: z.array(
    z.union([kodeverkVerdigruppeSchema, z.lazy(() => kodeverkGruppeSchema)])
  )
})

export type KodeverkGruppe = {
  type: KodeverkAlternativType.GRUPPE
  id: string
  visningsnavn: string
  alternativer: (KodeverkVerdigruppe | KodeverkGruppe)[]
  valgt: boolean
}

export type KodeverkAlternativ = KodeverkGruppe | KodeverkVerdigruppe

export const kodeverkResponseSchema = z.object({
  tiltakskode: z.string(),
  alternativer: z.array(
    z.union([kodeverkGruppeSchema, kodeverkVerdigruppeSchema])
  )
})

export type KodeverkResponse = z.infer<typeof kodeverkResponseSchema>
