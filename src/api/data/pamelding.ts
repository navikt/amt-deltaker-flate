import { z } from 'zod'

export const malSchema = z.object({
	visningsTekst: z.string(), // kommer fra valp
	kode: z.string(), // Enum/String, kommer fra valp
	valgt: z.boolean(),
	beskrivelse: z.string().nullable()
})

export const pameldingSchema = z.object({
	deltakerId: z.string().uuid(),
	deltakerlisteId: z.string().uuid(),
	deltakerlisteNavn: z.string(),
	arrangorNavn: z.string(),
	oppstartsType: z.string(),
	mal: z.array(malSchema),
	bakgrunnsinformasjon: z.string().nullable()
})

export type Mal = z.infer<typeof malSchema>
export type Pamelding = z.infer<typeof pameldingSchema>
