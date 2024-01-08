import {z} from 'zod'
import {DeltakelsesprosentValg} from '../utils.ts'

export const pameldingFormSchema = z.object({
  valgteMal: z.array(z.string()),
  malAnnetBeskrivelse: z.string(),
  bakgrunnsinformasjon: z.string()
    .max(500, 'Kan ikke være mer enn 500 tegn'),
  deltakelsesprosentValg: z.nativeEnum(DeltakelsesprosentValg).optional(),
  deltakelsesprosent: z.string().optional(),
  dagerPerUke: z.string().optional()
})

export type PameldingFormValues = z.infer<typeof pameldingFormSchema>
