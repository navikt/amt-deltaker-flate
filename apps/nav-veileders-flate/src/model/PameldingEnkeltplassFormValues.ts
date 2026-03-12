import { Tiltakskode } from 'deltaker-flate-common'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/pamelding.ts'

dayjs.extend(customParseFormat)

export const TEKSTFELT_MAX_TEGN = 1000

const datoSchema = z
  .string()
  .optional()
  .refine((val) => !val || dayjs(val, 'DD.MM.YYYY', true).isValid(), {
    message: 'Ugyldig datoformat. Bruk dd.mm.åååå.'
  })
  .refine(
    (val) => !val || !dayjs(val, 'DD.MM.YYYY', true).isBefore(dayjs(), 'day'),
    { message: 'Dato kan ikke være i fortiden.' }
  )

export const pameldingEnkeltplassFormSchema = z.object({
  tiltakskode: z.enum(Tiltakskode),
  beskrivelseKurs: z
    .string()
    .min(1, 'Beskrivelse av kurset er påkrevd.')
    .max(
      TEKSTFELT_MAX_TEGN,
      `Beskrivelse av kurset kan ikke ha mer enn ${TEKSTFELT_MAX_TEGN} tegn.`
    ),
  startDato: datoSchema,
  sluttDato: datoSchema,
  prisinformasjon: z
    .string()
    .min(1, 'Prisinformasjon er påkrevd.')
    .max(
      TEKSTFELT_MAX_TEGN,
      `Prisinformasjon kan ikke ha mer enn ${TEKSTFELT_MAX_TEGN} tegn.`
    )
})

export type PameldingEnkeltplassFormValues = z.infer<
  typeof pameldingEnkeltplassFormSchema
>

export const generateFormDefaultValues = (
  pamelding: DeltakerResponse
): PameldingEnkeltplassFormValues => {
  return {
    tiltakskode: pamelding.deltakerliste.tiltakskode,
    beskrivelseKurs: '', // TODO hent dette fra deltakerliste?
    startDato: pamelding.startdato ?? undefined, // TODO er det fra deltakerliste?
    sluttDato: pamelding.sluttdato ?? undefined,
    prisinformasjon: ''
  }
}
