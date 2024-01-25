import {z} from 'zod'
import {DeltakelsesprosentValg, MAL_TYPE_ANNET} from '../utils.ts'
import {Mal, PameldingResponse} from '../api/data/pamelding.ts'

export const pameldingFormSchema = z
  .object({
    valgteMal: z.string().array().nonempty('Du må velge innhold'),
    malAnnetBeskrivelse: z
      .string()
      .max(250, 'Beskrivelse for mål Annet kan ikke være mer enn 250 tegn'),
    bakgrunnsinformasjon: z
      .string()
      .min(1, { message: 'Du må skrive noe for mål Annet' })
      .max(1000, 'Bakgrunnsinformasjon kan ikke være mer enn 1000 tegn'),
    deltakelsesprosentValg: z.nativeEnum(DeltakelsesprosentValg).optional(),
    deltakelsesprosent: z
      .number({
        invalid_type_error: 'Deltakelsesprosent må være ett tall mellom 0 og 100.'
      })
      .gte(0.1, { message: 'Deltakelsesprosent må være større enn 0' })
      .lte(100, { message: 'Deltakelsesprosent må være mindre enn 100' })
      .optional(),
    dagerPerUke: z
      .number()
      .gte(0.1, { message: 'Dager per uke må være større enn 0' })
      .lte(7, { message: 'Dager per uke må være mindre enn 7' })
      .optional()
  })
  .refine(
    (schema) => {
      if (schema.valgteMal?.find((valgtMal) => valgtMal === MAL_TYPE_ANNET)) {
        return schema.malAnnetBeskrivelse.length > 0
      } else return true
    },
    {
      message: 'Du må skrive noe for mål Annet',
      path: ['malAnnetBeskrivelse']
    }
  )
  .refine(
    (schema) => {
      if (schema.deltakelsesprosentValg === DeltakelsesprosentValg.NEI) {
        return !!schema.deltakelsesprosent
      } else return true
    },
    {
      message: 'Du må skrive inn deltakelsesprosent',
      path: ['deltakelsesprosent']
    }
  )

export type PameldingFormValues = z.infer<typeof pameldingFormSchema>

export const generateFormDefaultValues = (pamelding: PameldingResponse) => {
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
    dagerPerUke: pamelding.dagerPerUke ?? undefined
  }
}
