import {z} from 'zod'
import {DeltakelsesprosentValg, MAL_TYPE_ANNET} from '../utils.ts'
import {Mal, PameldingResponse} from '../api/data/pamelding.ts'

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

export const generateFormDefaultValues = (pamelding: PameldingResponse): PameldingFormValues => {
  const showProsentValg = (): DeltakelsesprosentValg => {
    if (pamelding.deltakelsesprosent && pamelding.deltakelsesprosent < 100) {
      return DeltakelsesprosentValg.NEI
    }
    return DeltakelsesprosentValg.JA
  }

  const getMalAnnetBeskrivelse = (): string | undefined => {
    const annetCheckbox = pamelding.mal.find((m: Mal) => m.type === MAL_TYPE_ANNET)

    if (annetCheckbox?.valgt) {
      return annetCheckbox.beskrivelse ?? undefined
    }
    return undefined
  }

  return {
    valgteMal: pamelding.mal.filter((e) => e.valgt).map((e) => e.type),
    malAnnetBeskrivelse: getMalAnnetBeskrivelse(),
    bakgrunnsinformasjon: pamelding.bakgrunnsinformasjon ?? '',
    deltakelsesprosentValg: showProsentValg(),
    deltakelsesprosent: pamelding.deltakelsesprosent ?? undefined,
    dagerPerUke: pamelding. dagerPerUke ?? undefined
  }

}
