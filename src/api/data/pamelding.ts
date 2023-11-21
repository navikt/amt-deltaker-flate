import {z} from 'zod'

export const malSchema = z.object({
  visningsTekst: z.string(), // kommer fra valp
  type: z.string(), // Enum/String, kommer fra valp
  valgt: z.boolean(),
  beskrivelse: z.string().nullable()
})

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  deltakerlisteNavn: z.string(),
  tiltakstype: z.string(), //Enum?
  arrangorNavn: z.string(),
  oppstartstype: z.string(),
  mal: z.array(malSchema),
})

export const pameldingSchema = z.object({
  deltakerId: z.string().uuid(),
  deltakerliste: deltakerlisteSchema,
})

export type Mal = z.infer<typeof malSchema>
export type PameldingResponse = z.infer<typeof pameldingSchema>
