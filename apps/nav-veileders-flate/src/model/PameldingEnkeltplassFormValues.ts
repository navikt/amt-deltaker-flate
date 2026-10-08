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
  erSluttdatoInnenforEksisterendeMaksUnntak,
  getMaxVarighetDato,
  getSenesteTillatteSluttdato,
  getVarighetValgFeilmelding
} from '../utils/varighet.ts'
import {
  generateKodeverkDefaultValues,
  innholdFormSchema,
  kategoriseringValgSchema,
  sertifiseringValgSchema,
  validateKodeverkAlternativer
} from './OpplaringKategoriseringFormValues.ts'
import { validatePrisinformasjon } from './PrisinformasjonFormValues.ts'

export const DATE_FORMAT = 'DD.MM.YYYY'
export const STARTDATO_FOR_TIDLIG_FEILMELDING =
  'Startdato kan ikke være mer enn to måneder tilbake i tid.'
export const SLUTTDATO_FOR_TIDLIG_FEILMELDING =
  'Sluttdato kan ikke være mer enn to måneder tilbake i tid.'
export const MIN_DAGER_PER_UKE = 1
export const MAX_DAGER_PER_UKE = 7
export const dagerPerUkeFeilmelding = `Antall dager i uka må være et helt tall fra ${MIN_DAGER_PER_UKE} til ${MAX_DAGER_PER_UKE}.`

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
) => {
  const eksisterendeStartdato = pamelding.startdato
    ? dayjs(pamelding.startdato).format(DATE_FORMAT)
    : undefined
  const eksisterendeSluttdato = pamelding.sluttdato
    ? dayjs(pamelding.sluttdato).format(DATE_FORMAT)
    : undefined
  const tidligsteStartdato = dayjs().subtract(2, 'month')

  return (
    z
      .looseObject({
        tiltakskode: z.enum(Tiltakskode),
        innhold: innholdFormSchema,
        arrangorUnderenhet: z
          .string()
          .min(1, 'Du må velge en underenhet for tiltaksarrangøren.'),
        arrangorNavn: z.string().optional(),
        startdato: dateSchema('Startdato').refine((date) => {
          if (date === eksisterendeStartdato) return true
          return !dayjs(date, DATE_FORMAT, true).isBefore(
            tidligsteStartdato,
            'date'
          )
        }, STARTDATO_FOR_TIDLIG_FEILMELDING),
        sluttdato: dateSchema('Sluttdato'),
        pristype: z.enum(PrisinformasjonType).nullable(),
        prisinformasjon: prisinformasjonSchema.nullable(),
        kategoriseringValg: kategoriseringValgSchema,
        sertifiseringValg: sertifiseringValgSchema,
        dagerPerUke: z
          .number({
            error: () => dagerPerUkeFeilmelding
          })
          .nullable()
          .refine(
            (value) =>
              value === null ||
              (Number.isInteger(value) &&
                value >= MIN_DAGER_PER_UKE &&
                value <= MAX_DAGER_PER_UKE),
            { message: dagerPerUkeFeilmelding }
          )
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
          if (start || !slutt || schema.sluttdato === eksisterendeSluttdato) {
            return true
          }
          return !slutt.isBefore(tidligsteStartdato, 'date')
        },
        {
          message: SLUTTDATO_FOR_TIDLIG_FEILMELDING,
          path: ['sluttdato']
        }
      )
      .superRefine((schema, ctx) => {
        const start = getDayjsFromString(schema.startdato)
        const slutt = getDayjsFromString(schema.sluttdato)
        if (!start || !slutt) return

        const maxVarighetDato = getMaxVarighetDato(pamelding, start.toDate())
        const eksisterendeSluttdatoErTillatt =
          erSluttdatoInnenforEksisterendeMaksUnntak(
            slutt,
            pamelding.sluttdato,
            maxVarighetDato
          )

        if (
          !maxVarighetDato ||
          slutt.isSameOrBefore(maxVarighetDato, 'date') ||
          eksisterendeSluttdatoErTillatt
        ) {
          return
        }

        ctx.addIssue({
          code: 'custom',
          message: getVarighetValgFeilmelding(
            getSenesteTillatteSluttdato(
              pamelding.sluttdato,
              maxVarighetDato.toDate()
            )
          ),
          path: ['sluttdato']
        })
      })
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
  )
}

export type PameldingEnkeltplassFormValues = z.infer<
  ReturnType<typeof createPameldingEnkeltplassFormSchema>
>

export const generateFormDefaultValues = (
  deltaker: DeltakerResponse
): PameldingEnkeltplassFormValues => {
  return {
    tiltakskode: deltaker.deltakerliste.tiltakskode.kode,
    arrangorUnderenhet:
      deltaker.deltakerliste.arrangor?.organisasjonsnummer ?? '',
    arrangorNavn: deltaker.deltakerliste.arrangor?.navn,
    startdato: deltaker.startdato
      ? dayjs(deltaker.startdato).format(DATE_FORMAT)
      : '',
    sluttdato: deltaker.sluttdato
      ? dayjs(deltaker.sluttdato).format(DATE_FORMAT)
      : '',
    pristype: deltaker.deltakerliste.prisinformasjon?.type ?? null,
    prisinformasjon: deltaker.deltakerliste.prisinformasjon ?? null,
    dagerPerUke: deltaker.dagerPerUke,
    ...generateKodeverkDefaultValues(deltaker)
  }
}
