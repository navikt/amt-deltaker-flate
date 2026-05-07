import { z } from 'zod'

export const kodeverkVerdiSchema = z.object({
  type: z.literal('Verdi'),
  id: z.uuid(),
  visningsnavn: z.string(),
  valgt: z.boolean()
})

export type KodeverkVerdi = z.infer<typeof kodeverkVerdiSchema>

export const kodeverkVerdigruppeSchema = z.object({
  type: z.literal('Verdigruppe'),
  id: z.uuid(),
  visningsnavn: z.string(),
  seleksjonstype: z.enum(['ENKELTVALG', 'FLERVALG']),
  alternativer: z.array(kodeverkVerdiSchema)
})

export type KodeverkVerdigruppe = z.infer<typeof kodeverkVerdigruppeSchema>

export const kodeverkGruppeSchema: z.ZodType = z.object({
  type: z.literal('Gruppe'),
  id: z.uuid(),
  visningsnavn: z.string(),
  alternativer: z.array(
    z.union([kodeverkVerdigruppeSchema, z.lazy(() => kodeverkGruppeSchema)])
  )
})

export type KodeverkGruppe = {
  type: 'Gruppe'
  id: string
  visningsnavn: string
  alternativer: (KodeverkVerdigruppe | KodeverkGruppe)[]
}

export type KodeverkAlternativ = KodeverkGruppe | KodeverkVerdigruppe

export const kodeverkResponseSchema = z.object({
  tiltakskode: z.string(),
  alternativer: z.array(
    z.union([kodeverkGruppeSchema, kodeverkVerdigruppeSchema])
  )
})

export type KodeverkResponse = z.infer<typeof kodeverkResponseSchema>
