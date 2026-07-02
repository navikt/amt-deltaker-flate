import dayjs from 'dayjs'
import {
  getDayjsFromString,
  prisinformasjonSchema,
  PrisinformasjonType,
  Tiltakskode
} from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import { KodeverkResponse } from '../api/data/kodeverk.ts'
import {
  getMaxVarighetDato,
  VARGIHET_VALG_FEILMELDING
} from '../utils/varighet.tsx'
import {
  generateKodeverkDefaultValues,
  innholdFormSchema,
  kategoriseringValgSchema,
  sertifiseringValgSchema,
  validateKodeverkAlternativer
} from './OpplaringKategoriseringFormValues.ts'
import { validatePrisinformasjon } from './PrisinformasjonFormValues.ts'

export const DATE_FORMAT = 'DD.MM.YYYY'

const dateSchema = (feltnavn: string) =>
  z
    .string()
    .min(1, `${feltnavn} er påkrevd.`)
    .refine((date) => {
      return dayjs(date, DATE_FORMAT, true).isValid()
    }, 'Ugyldig datoformat: Bruk dd.mm.åååå')

export const createPameldingEnkeltplassFormSchema = (
  pamelding: DeltakerResponse,
  kodeverk?: KodeverkResponse
) =>
  z
    .looseObject({
      tiltakskode: z.enum(Tiltakskode),
      innhold: innholdFormSchema,
      arrangorUnderenhet: z
        .string()
        .min(1, 'Du må velge en underenhet for tiltaksarrangøren.'),
      startdato: dateSchema('Startdato'),
      sluttdato: dateSchema('Sluttdato'),
      pristype: z.enum(PrisinformasjonType).nullable(),
      prisinformasjon: prisinformasjonSchema.nullable(),
      kategoriseringValg: kategoriseringValgSchema,
      sertifiseringValg: sertifiseringValgSchema
    })
    .refine((schema) => schema.pristype !== null, {
      message: 'Du må velge et alternativ for Navs kostnader.',
      path: ['pristype']
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
    // superRefine bruker ctx (context object) for å pushe "feil" inn i validatoren for flere objekter
    .superRefine((schema, ctx) => {
      if (!kodeverk) {
        return
      }

      validateKodeverkAlternativer(kodeverk.alternativer, schema, ctx)
    })
    .superRefine((schema, ctx) => {
      validatePrisinformasjon(schema, ctx)
    })

export type PameldingEnkeltplassFormValues = z.infer<
  ReturnType<typeof createPameldingEnkeltplassFormSchema>
>

export const generateFormDefaultValues = (
  deltaker: DeltakerResponse
): PameldingEnkeltplassFormValues => {
  return {
    tiltakskode: deltaker.deltakerliste.tiltakskode,
    arrangorUnderenhet:
      deltaker.deltakerliste.arrangor?.organisasjonsnummer ?? '',
    startdato: deltaker.startdato
      ? dayjs(deltaker.startdato).format(DATE_FORMAT)
      : '',
    sluttdato: deltaker.sluttdato
      ? dayjs(deltaker.sluttdato).format(DATE_FORMAT)
      : '',
    pristype: deltaker.deltakerliste.prisinformasjon?.type ?? null,
    prisinformasjon: deltaker.deltakerliste.prisinformasjon ?? null,
    ...generateKodeverkDefaultValues(deltaker)
  }
}
