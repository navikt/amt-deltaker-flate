import dayjs from 'dayjs'
import { getDayjsFromString, Tiltakskode } from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import {
  getMaxVarighetDato,
  VARGIHET_VALG_FEILMELDING
} from '../utils/varighet.tsx'
import { getInnholdAnnetBeskrivelse } from './PameldingFormValues.ts'

export const INNHOLD_MAX_TEGN = 250
export const PRISINFO_MAX_TEGN = 600
export const DATE_FORMAT = 'DD.MM.YYYY'

const dateShema = z
  .string()
  .optional()
  .refine((date) => {
    if (!date) return true
    return dayjs(date, DATE_FORMAT, true).isValid()
  }, 'Ugyldig datofomat: Bruk dd.mm.åååå')

export const createPameldingEnkeltplassFormSchema = (
  pamelding: DeltakerResponse
) =>
  z
    .object({
      tiltakskode: z.enum(Tiltakskode),
      innhold: z
        .string()
        .min(1, 'Innholdet til kurset er påkrevd.')
        .max(
          INNHOLD_MAX_TEGN,
          `Innholdet til kurset kan ikke ha mer enn ${INNHOLD_MAX_TEGN} tegn.`
        ),
      arrangorUnderenhet: z
        .string()
        .min(1, 'Tiltaksarrangørens underenhet er påkrevd.'),
      startdato: dateShema,
      sluttdato: dateShema,
      prisinformasjon: z
        .string()
        .min(1, 'Prisinformasjon er påkrevd.')
        .max(
          PRISINFO_MAX_TEGN,
          `Prisinformasjon kan ikke ha mer enn ${PRISINFO_MAX_TEGN} tegn.`
        )
    })
    .refine(
      (schema) => {
        const harStart = !!schema.startdato
        const harSlutt = !!schema.sluttdato
        if (harSlutt != harStart) return false
        return true
      },
      {
        message:
          'Hvis du registrerer start- eller sluttdato, må begge datoene fylles ut.',
        path: ['sluttdato']
      }
    )
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
  deltaker: DeltakerResponse
): PameldingEnkeltplassFormValues => {
  return {
    tiltakskode: deltaker.deltakerliste.tiltakskode,
    innhold: getInnholdAnnetBeskrivelse(deltaker) ?? '',
    arrangorUnderenhet: '', // TODO deltaker.deltakerliste.arrangorUnderenhet
    startdato: deltaker.startdato
      ? dayjs(deltaker.startdato).format(DATE_FORMAT)
      : undefined,
    sluttdato: deltaker.sluttdato
      ? dayjs(deltaker.sluttdato).format(DATE_FORMAT)
      : undefined,
    prisinformasjon: deltaker.prisinformasjon ?? ''
  }
}
