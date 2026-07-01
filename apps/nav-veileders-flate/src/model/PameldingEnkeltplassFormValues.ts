import dayjs from 'dayjs'
import {
  getDayjsFromString,
  OpplaringRepresenterer,
  prisinformasjonSchema,
  PrisinformasjonType,
  Tiltakskode
} from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import {
  KodeverkAlternativType,
  KodeverkContainer,
  KodeverkResponse,
  KodeverkUtdanningGruppe,
  KodeverkVerdigruppeBase
} from '../api/data/kodeverk.ts'
import {
  getValgteSertifiseringer,
  getValgteVerdier
} from '../utils/kodeverk.ts'
import {
  getMaxVarighetDato,
  VARGIHET_VALG_FEILMELDING
} from '../utils/varighet.tsx'
import { getInnholdAnnetBeskrivelse } from './PameldingFormValues.ts'
import { validatePrisinformasjon } from './PrisinformasjonFormValues.ts'

export const INNHOLD_MAX_TEGN = 250
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
      innhold: z
        .string()
        .min(1, 'Innholdet til kurset er påkrevd.')
        .max(
          INNHOLD_MAX_TEGN,
          `Innholdet til kurset kan ikke ha mer enn ${INNHOLD_MAX_TEGN} tegn.`
        ),
      arrangorUnderenhet: z
        .string()
        .min(1, 'Du må velge en underenhet for tiltaksarrangøren.'),
      startdato: dateSchema('Startdato'),
      sluttdato: dateSchema('Sluttdato'),
      pristype: z.enum(PrisinformasjonType).nullable(),
      prisinformasjon: prisinformasjonSchema.nullable(),
      kodeverkValg: z.array(
        z.object({
          representerer: z.enum(OpplaringRepresenterer),
          valgteIder: z.array(z.string())
        })
      ),
      sertifiseringValg: z.array(z.object({ id: z.number(), navn: z.string() }))
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
    innhold: getInnholdAnnetBeskrivelse(deltaker) ?? '',
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
    kodeverkValg: getValgteVerdier(
      deltaker.deltakerliste.opplaringKategoriseringValg
    ),
    sertifiseringValg: getValgteSertifiseringer(
      deltaker.deltakerliste.opplaringKategoriseringValg
    )
  }
}

const validateKodeverkAlternativer = (
  alternativer: KodeverkContainer[],
  schema: PameldingEnkeltplassFormValues,
  ctx: z.RefinementCtx
) => {
  alternativer.forEach((alternativ) => {
    if (alternativ.type === KodeverkAlternativType.VERDIGRUPPE) {
      validateVerdigruppe(alternativ, schema, ctx)
      return
    }

    if (alternativ.type === KodeverkAlternativType.UTDANNING_GRUPPE) {
      validateUtdanningsgruppe(alternativ, schema, ctx)
      return
    }

    // Søk sertifisering er ikke påkrevd.
    if (alternativ.type === KodeverkAlternativType.VERDIGRUPPE_SOK) {
      return
    }
  })
}

const validateVerdigruppe = (
  alternativ: KodeverkVerdigruppeBase,
  schema: PameldingEnkeltplassFormValues,
  ctx: z.RefinementCtx
) => {
  if (!alternativ.pakrevd) {
    return
  }

  const valgtIder = schema.kodeverkValg
    .filter((valg) => valg.representerer === alternativ.representerer)
    .flatMap((valg) => valg.valgteIder)

  if (valgtIder.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: `${alternativ.visningsnavn} er påkrevd.`,
      path: [`kodeverkValg_${alternativ.representerer}`]
    })
  }
}

const validateUtdanningsgruppe = (
  alternativ: KodeverkUtdanningGruppe,
  schema: PameldingEnkeltplassFormValues,
  ctx: z.RefinementCtx
) => {
  if (!alternativ.pakrevd) {
    return
  }

  const valgtIder = schema.kodeverkValg
    .filter((valg) => valg.representerer === alternativ.representerer)
    .flatMap((valg) => valg.valgteIder)

  if (valgtIder.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: `${alternativ.visningsnavn} er påkrevd.`,
      path: [`kodeverkValg_${alternativ.representerer}`]
    })
  }

  // Sjekk om lærefag er valgt kun for valgt utdanning
  const valgtUtdanning = alternativ.utdanninger.find((u) =>
    valgtIder.includes(u.id)
  )
  if (valgtUtdanning) {
    validateVerdigruppe(valgtUtdanning.larefag, schema, ctx)
  }
}
