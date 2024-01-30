import {z} from 'zod'
import {DeltakelsesprosentValg, MAL_TYPE_ANNET} from '../utils.ts'
import {Mal, PameldingResponse} from '../api/data/pamelding.ts'

export const BESKRIVELSE_MAX_TEGN = 250
export const BAKGRUNNSINFORMASJON_MAKS_TEGN = 1000

export const pameldingFormSchema = z
  .object({
    valgteMal: z.string().array(),
    malAnnetBeskrivelse: z
      .string()
      .max(
        BESKRIVELSE_MAX_TEGN,
        `Beskrivelse for mål Annet kan ikke være mer enn ${BESKRIVELSE_MAX_TEGN} tegn`
      )
      .optional(),
    bakgrunnsinformasjon: z
      .string()
      .max(
        BAKGRUNNSINFORMASJON_MAKS_TEGN,
        `Bakgrunnsinformasjon kan ikke være mer enn ${BAKGRUNNSINFORMASJON_MAKS_TEGN} tegn`
      )
      .optional(),
    deltakelsesprosentValg: z.nativeEnum(DeltakelsesprosentValg).optional(),
    deltakelsesprosent: z
      .number({
        invalid_type_error: 'Deltakelsesprosent må være ett tall mellom 0 og 100.'
      })
      .int({ message: 'Deltakelsesprosent må være et heltall' })
      .gte(1, { message: 'Deltakelsesprosent må være større enn 0' })
      .lte(99, { message: 'Deltakelsesprosent må være mindre enn 100%' })
      .optional(),
    dagerPerUke: z
      .number({
        invalid_type_error: 'Dager per uke må være ett tall mellom 0 og 5.'
      })
      .int({ message: 'Dager per uke må være et heltall' })
      .gte(1, { message: 'Dager per uke må være større enn 0' })
      .lte(5, { message: 'Dager per uke må være mindre enn 6' })
      .optional()
  })
  .refine(
    (schema) => {
      if (schema.valgteMal?.find((valgtMal) => valgtMal === MAL_TYPE_ANNET)) {
        return schema.malAnnetBeskrivelse ? schema.malAnnetBeskrivelse?.length > 0 : false
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
    bakgrunnsinformasjon: pamelding.bakgrunnsinformasjon ?? undefined,
    deltakelsesprosentValg: showProsentValg(),
    deltakelsesprosent: pamelding.deltakelsesprosent ?? undefined,
    dagerPerUke: pamelding.dagerPerUke ?? undefined
  }
}
