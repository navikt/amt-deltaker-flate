import dayjs from 'dayjs'
import { Tiltakskode } from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/pamelding.ts'
import {
  getMaxVarighetDato,
  VARGIHET_VALG_FEILMELDING
} from '../utils/varighet.tsx'

export const TEKSTFELT_MAX_TEGN = 1000

const dateShema = z
  .date()
  .optional()
  .refine((date) => {
    if (!date) return true
    return !isNaN(date.getTime())
  }, 'Ugyldig datofomat: Bruk dd.mm.åååå')

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
      startdato: dateShema,
      sluttdato: dateShema,
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
        const harStart = !!schema.startdato
        const harSlutt = !!schema.sluttdato
        if (harSlutt && !harStart) return false
        return true
      },
      {
        message: 'Startdato må fylles ut sammen med sluttdato.',
        path: ['startdato']
      }
    )
    .refine(
      (schema) => {
        const start = dayjs(schema.startdato)
        const slutt = dayjs(schema.sluttdato)
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
        const start = dayjs(schema.startdato)
        const slutt = dayjs(schema.sluttdato)
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
    startdato: pamelding.startdato
      ? dayjs(pamelding.startdato).toDate()
      : undefined,
    sluttdato: pamelding.sluttdato
      ? dayjs(pamelding.sluttdato).toDate()
      : undefined,
    prisinformasjon: ''
  }
}
