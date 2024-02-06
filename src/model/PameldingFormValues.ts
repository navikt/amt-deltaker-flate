import { z } from 'zod'
import { Mal, PameldingResponse } from '../api/data/pamelding.ts'
import { DeltakelsesprosentValg, MAL_TYPE_ANNET } from '../utils/utils.ts'

export const BESKRIVELSE_MAX_TEGN = 250
export const BAKGRUNNSINFORMASJON_MAKS_TEGN = 1000
export const BESKRIVELSE_ANNET_MAX_TEGN = 250

const deltakelsesprosentFeilmelding = 'Deltakelsesprosent må være et helt tall fra 1 til 100.'
const dagerPerUkeFeilmelding = 'Dager per uke må være et helt tall fra 1 til 5.'

export const pameldingFormSchema = z
  .object({
    tilgjengeligeMal: z.string().array(),
    valgteMal: z.string().array(),
    malAnnetBeskrivelse: z
      .string()
      .max(BESKRIVELSE_MAX_TEGN, `"Annet" kan ikke være mer enn ${BESKRIVELSE_MAX_TEGN} tegn.`)
      .optional(),
    bakgrunnsinformasjon: z
      .string()
      .max(
        BAKGRUNNSINFORMASJON_MAKS_TEGN,
        `Bakgrunnsinformasjon kan ikke være mer enn ${BAKGRUNNSINFORMASJON_MAKS_TEGN} tegn.`
      )
      .optional(),
    deltakelsesprosentValg: z.nativeEnum(DeltakelsesprosentValg).optional(),
    deltakelsesprosent: z
      .number({
        invalid_type_error: deltakelsesprosentFeilmelding
      })
      .int({ message: deltakelsesprosentFeilmelding })
      .gte(1, { message: deltakelsesprosentFeilmelding })
      .lte(99, { message: deltakelsesprosentFeilmelding })
      .optional(),
    dagerPerUke: z
      .number({
        invalid_type_error: dagerPerUkeFeilmelding
      })
      .int({ message: dagerPerUkeFeilmelding })
      .gte(1, { message: dagerPerUkeFeilmelding })
      .lte(5, { message: dagerPerUkeFeilmelding })
      .optional()
  })
  .refine(
    (schema) => {
      if (schema.tilgjengeligeMal.length > 0) {
        return schema.valgteMal.length > 0
      } else return true
    },
    {
      message: 'Velg minst ett innhold.',
      path: ['valgteMal']
    }
  )
  .refine(
    (schema) => {
      if (schema.valgteMal?.find((valgtMal) => valgtMal === MAL_TYPE_ANNET)) {
        return schema.malAnnetBeskrivelse ? schema.malAnnetBeskrivelse?.length > 0 : false
      } else return true
    },
    {
      message: 'Du må skrive noe for "Annet" innhold.',
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
      message: 'Du må skrive inn deltakelsesprosent.',
      path: ['deltakelsesprosent']
    }
  )

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
    tilgjengeligeMal: pamelding.mal.map((e) => e.type),
    valgteMal: pamelding.mal.filter((e) => e.valgt).map((e) => e.type),
    malAnnetBeskrivelse: getMalAnnetBeskrivelse(),
    bakgrunnsinformasjon: pamelding.bakgrunnsinformasjon ?? undefined,
    deltakelsesprosentValg: showProsentValg(),
    deltakelsesprosent: pamelding.deltakelsesprosent ?? undefined,
    dagerPerUke: pamelding.dagerPerUke ?? undefined
  }
}
