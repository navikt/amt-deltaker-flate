import z from 'zod'

export const visningsnavnSchema = z.object({
  tiltakHosArrangorTittel: z.string(),
  tiltakHosArrangorIngressTekst: z.string(),
  kladdTiltakHosArrangorTittel: z.string()
})
