import dayjs from 'dayjs'
import {
  getDayjsFromString,
  harGyldigDatoformat,
  prisinformasjonSchema,
  PrisinformasjonType,
  Tiltakskode
} from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import { KodeverkResponse } from '../api/data/kodeverk.ts'
import {
  getMaxVarighetDato,
  MAX_START_DATO,
  MIN_START_DATO,
  START_DATO_FOER_2000_FEILMELDING,
  UGYLDIG_DATO,
  UGYLDIG_DATO_FORMAT,
  START_DATO_ETTER_5_AAR_FEILMELDING,
  VARGIHET_VALG_FEILMELDING,
  SLUTTDATO_ETTER_STARTDATO_FEILMELDING
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

export const MIN_DAGER_PER_UKE = 1
export const MAX_DAGER_PER_UKE = 7
export const dagerPerUkeFeilmelding = `Antall dager i uka må være et helt tall fra ${MIN_DAGER_PER_UKE} til ${MAX_DAGER_PER_UKE}.`

export const createPameldingEnkeltplassFormSchema = (
  deltaker: DeltakerResponse,
  kodeverk?: KodeverkResponse
) =>
  z
    .looseObject({
      tiltakskode: z.enum(Tiltakskode),
      innhold: innholdFormSchema,
      arrangorUnderenhet: z
        .string()
        .min(1, 'Du må velge en underenhet for tiltaksarrangøren.'),
      arrangorNavn: z.string().optional(),
      startdato: z.string(),
      sluttdato: z.string(),
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
    .superRefine((schema, ctx) => {
      validerDatoer(deltaker, schema, ctx)
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
    .transform((schema) => ({
      ...schema,
      startdato: parsePameldingDato(schema.startdato)!.format(DATE_FORMAT),
      sluttdato: parsePameldingDato(schema.sluttdato)!.format(DATE_FORMAT)
    }))

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

export const parsePameldingDato = (value: string) => {
  if (!harGyldigDatoformat(value)) return undefined
  return getDayjsFromString(value)
}

const validerDatoer = (
  deltaker: DeltakerResponse,
  schema: PameldingEnkeltplassFormValues,
  ctx: z.RefinementCtx
) => {
  const validerDato = (
    value: string,
    felt: 'startdato' | 'sluttdato',
    feltnavn: string
  ) => {
    const parsed = parsePameldingDato(value)
    let message: string | undefined
    if (!value) {
      message = `${feltnavn} er påkrevd.`
    } else if (!harGyldigDatoformat(value)) {
      message = UGYLDIG_DATO_FORMAT
    } else if (!parsed) {
      message = UGYLDIG_DATO
    }
    if (message) {
      ctx.addIssue({ code: 'custom', message, path: [felt] })
      return undefined
    }
    return parsed
  }

  const start = validerDato(schema.startdato, 'startdato', 'Startdato')
  const slutt = validerDato(schema.sluttdato, 'sluttdato', 'Sluttdato')

  if (!start) return
  if (start.isBefore(MIN_START_DATO, 'date')) {
    ctx.addIssue({
      code: 'custom',
      message: START_DATO_FOER_2000_FEILMELDING,
      path: ['startdato']
    })
    return
  }
  if (start.isAfter(MAX_START_DATO, 'date')) {
    ctx.addIssue({
      code: 'custom',
      message: START_DATO_ETTER_5_AAR_FEILMELDING,
      path: ['startdato']
    })
    return
  }
  if (!slutt) return
  if (slutt.isBefore(start, 'date')) {
    ctx.addIssue({
      code: 'custom',
      message: SLUTTDATO_ETTER_STARTDATO_FEILMELDING,
      path: ['sluttdato']
    })
  } else {
    const maxVarighetDato = getMaxVarighetDato(deltaker, start.toDate())
    if (!slutt.isSameOrBefore(dayjs(maxVarighetDato), 'date')) {
      ctx.addIssue({
        code: 'custom',
        message: VARGIHET_VALG_FEILMELDING,
        path: ['sluttdato']
      })
    }
  }
}
