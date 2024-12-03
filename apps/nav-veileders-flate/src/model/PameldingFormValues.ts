import {
  INNHOLD_TYPE_ANNET,
  Tiltakstype,
  tiltakstypeSchema
} from 'deltaker-flate-common'
import { string, z } from 'zod'
import {
  PameldingResponse,
  innholdselementSchema
} from '../api/data/pamelding.ts'
import { DeltakelsesprosentValg } from '../utils/utils.ts'

export const BESKRIVELSE_MAX_TEGN = 250
export const BAKGRUNNSINFORMASJON_MAKS_TEGN = 1000
export const BESKRIVELSE_ANNET_MAX_TEGN = 250

export const BEGRUNNELSE_MAKS_TEGN = 200

export const deltakelsesprosentFeilmelding =
  'Deltakelsesprosent må være et helt tall fra 1 til 100.'
export const dagerPerUkeFeilmelding =
  'Dager per uke må være et helt tall fra 1 til 5.'

export const erInnholdPakrevd = (tiltakstype: Tiltakstype) =>
  !(tiltakstype === Tiltakstype.VASV || tiltakstype === Tiltakstype.DIGIOPPARB)

export const pameldingFormSchema = z
  .object({
    tiltakstype: tiltakstypeSchema,
    tilgjengeligInnhold: innholdselementSchema.array(),
    innholdsTekst: string()
      .max(
        BESKRIVELSE_ANNET_MAX_TEGN,
        `Tiltaksinnholdet kan ikke være mer enn ${BESKRIVELSE_MAX_TEGN} tegn.`
      )
      .optional(),
    valgteInnhold: string().array(),
    innholdAnnetBeskrivelse: z
      .string()
      .max(
        BESKRIVELSE_MAX_TEGN,
        `Tiltaksinnholdet "Annet" kan ikke være mer enn ${BESKRIVELSE_MAX_TEGN} tegn.`
      )
      .optional(),
    bakgrunnsinformasjon: z
      .string()
      .max(
        BAKGRUNNSINFORMASJON_MAKS_TEGN,
        `Bakgrunnsinfo kan ikke være mer enn ${BAKGRUNNSINFORMASJON_MAKS_TEGN} tegn.`
      )
      .optional(),
    deltakelsesprosentValg: z.nativeEnum(DeltakelsesprosentValg).optional(),
    deltakelsesprosent: z
      .number({
        invalid_type_error: deltakelsesprosentFeilmelding
      })
      .int({ message: deltakelsesprosentFeilmelding })
      .gte(1, { message: deltakelsesprosentFeilmelding })
      .lte(100, { message: deltakelsesprosentFeilmelding })
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
      if (
        schema.tilgjengeligInnhold.length > 0 &&
        erInnholdPakrevd(schema.tiltakstype)
      ) {
        return schema.valgteInnhold.length > 0
      } else return true
    },
    {
      message: 'Velg minst ett innhold for tiltaket.',
      path: ['valgteInnhold']
    }
  )
  .refine(
    (schema) => {
      if (
        erInnholdPakrevd(schema.tiltakstype) &&
        schema.valgteInnhold?.find(
          (valgtInnhold) => valgtInnhold === INNHOLD_TYPE_ANNET
        )
      ) {
        return schema.innholdAnnetBeskrivelse
          ? schema.innholdAnnetBeskrivelse?.length > 0
          : false
      } else return true
    },
    {
      message: 'Når «Annet» er valgt, må du skrive noe innhold.',
      path: ['innholdAnnetBeskrivelse']
    }
  )
  .refine(
    (schema) => {
      // deltakelsesprosent er påkrevd hvis vi velger NEI
      if (schema.deltakelsesprosentValg === DeltakelsesprosentValg.NEI) {
        return !!schema.deltakelsesprosent
      } else return true
    },
    {
      message: deltakelsesprosentFeilmelding,
      path: ['deltakelsesprosent']
    }
  )

export type PameldingFormValues = z.infer<typeof pameldingFormSchema>

export const generateValgtInnholdKoder = (
  pamelding: PameldingResponse
): string[] => {
  const tilgjengeligInnnholdskoder =
    pamelding.deltakerliste.tilgjengeligInnhold.innhold.map(
      (i) => i.innholdskode
    )

  return (
    pamelding.deltakelsesinnhold?.innhold
      .filter(
        (i) => i.valgt && tilgjengeligInnnholdskoder.includes(i.innholdskode)
      )
      .map((i) => i.innholdskode) ?? []
  )
}

export const generateFormDefaultValues = (
  pamelding: PameldingResponse
): PameldingFormValues => {
  const showProsentValg = (): DeltakelsesprosentValg => {
    if (pamelding.deltakelsesprosent && pamelding.deltakelsesprosent < 100) {
      return DeltakelsesprosentValg.NEI
    }
    return DeltakelsesprosentValg.JA
  }

  const getInnholdAnnetBeskrivelse = (): string | undefined => {
    const annetCheckbox = pamelding.deltakelsesinnhold?.innhold.find(
      (i) => i.innholdskode === INNHOLD_TYPE_ANNET
    )

    if (annetCheckbox?.valgt) {
      return annetCheckbox.beskrivelse ?? undefined
    }
    return undefined
  }

  return {
    tiltakstype: pamelding.deltakerliste.tiltakstype,
    tilgjengeligInnhold: pamelding.deltakerliste.tilgjengeligInnhold.innhold,
    valgteInnhold: generateValgtInnholdKoder(pamelding),
    innholdAnnetBeskrivelse: getInnholdAnnetBeskrivelse(),
    innholdsTekst: getInnholdAnnetBeskrivelse(),
    bakgrunnsinformasjon: pamelding.bakgrunnsinformasjon ?? undefined,
    deltakelsesprosentValg: showProsentValg(),
    deltakelsesprosent: pamelding.deltakelsesprosent ?? undefined,
    dagerPerUke: pamelding.dagerPerUke ?? undefined
  }
}
