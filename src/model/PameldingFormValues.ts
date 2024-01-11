import {z} from 'zod'
import {DeltakelsesprosentValg} from '../utils.ts'

export const pameldingFormSchema = z.object({
  valgteMal: z.array(z.string()),
  malAnnetBeskrivelse: z.string().optional(),
  bakgrunnsinformasjon: z.string()
    .max(500, 'Kan ikke være mer enn 500 tegn'),
  deltakelsesprosentValg: z.nativeEnum(DeltakelsesprosentValg).optional(),
  deltakelsesprosent: z.number().optional(),
  dagerPerUke: z.number().optional()
})

export type PameldingFormValues = z.infer<typeof pameldingFormSchema>
