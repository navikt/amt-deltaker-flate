import dayjs from 'dayjs'
import { getDayjsFromString, Tiltakskode } from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/pamelding.ts'
import {
  getMaxVarighetDato,
  VARGIHET_VALG_FEILMELDING
} from '../utils/varighet.tsx'

export const TEKSTFELT_MAX_TEGN = 1000

const datoSchema = z
  .string()
  .optional()
  .refine((val) => !val || !!getDayjsFromString(val)?.isValid(), {
    message: 'Ugyldig datoformat. Bruk dd.mm.åååå.'
  })

export const createPameldingEnkeltplassFormSchema = (
  pamelding: DeltakerResponse
) =>
  z
    .object({
      tiltakskode: z.enum(Tiltakskode),
      beskrivelse: z
        .string()
        .min(1, 'Beskrivelse av kurset er påkrevd.')
        .max(
          TEKSTFELT_MAX_TEGN,
          `Beskrivelse av kurset kan ikke ha mer enn ${TEKSTFELT_MAX_TEGN} tegn.`
        ),
      startdato: datoSchema,
      sluttdato: datoSchema,
      prisinformasjon: z
        .string()
        .min(1, 'Prisinformasjon er påkrevd.')
        .max(
          TEKSTFELT_MAX_TEGN,
          `Prisinformasjon kan ikke ha mer enn ${TEKSTFELT_MAX_TEGN} tegn.`
        )
    })
    .refine(
      (schema) => {
        const start = getDayjsFromString(schema.startdato)
        const slutt = getDayjsFromString(schema.sluttdato)
        if (start && slutt) {
          return slutt.isSameOrAfter(start, 'date')
        }
        return true
      },
      {
        message: 'Sluttdato må være etter startdato.',
        path: ['sluttdato']
      }
    )
    .refine(
      (schema) => {
        const start = getDayjsFromString(schema.startdato)
        const slutt = getDayjsFromString(schema.sluttdato)
        if (start && slutt) {
          const maxVarighetDato = getMaxVarighetDato(pamelding, start.toDate())
          return slutt.isSameOrBefore(dayjs(maxVarighetDato), 'date')
        }
        return true
      },
      {
        message: VARGIHET_VALG_FEILMELDING,
        path: ['sluttdato']
      }
    )

export type PameldingEnkeltplassFormValues = z.infer<
  ReturnType<typeof createPameldingEnkeltplassFormSchema>
>

export const generateFormDefaultValues = (
  pamelding: DeltakerResponse
): PameldingEnkeltplassFormValues => {
  return {
    tiltakskode: pamelding.deltakerliste.tiltakskode,
    beskrivelse: '', // TODO hent dette fra deltakerliste?
    startdato: pamelding.startdato ?? undefined, // TODO er det fra deltakerliste?
    sluttdato: pamelding.sluttdato ?? undefined,
    prisinformasjon: ''
  }
}
