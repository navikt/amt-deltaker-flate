import dayjs from 'dayjs'
import {
  getDayjsFromString,
  IngenKostnaderAarsak,
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

export const INNHOLD_MAX_TEGN = 250
export const PRISINFO_MAX_TEGN = 600
export const PRISINFO_MAX_BELOP = 10_000_000
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
    prisinformasjon: deltaker.deltakerliste.prisinformasjon,
    kodeverkValg: getValgteVerdier(deltaker.deltakerliste.kodeverk),
    sertifiseringValg: getValgteSertifiseringer(deltaker.deltakerliste.kodeverk)
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

const addPrisinformasjonIssue = (
  ctx: z.RefinementCtx,
  id: string,
  message: string
) => {
  ctx.addIssue({
    code: 'custom',
    message,
    path: [`prisinformasjon_${id}`]
  })
}

const validatePrisinformasjon = (
  schema: PameldingEnkeltplassFormValues,
  ctx: z.RefinementCtx
) => {
  if (!schema.pristype) {
    return
  }

  if (!schema.prisinformasjon) {
    if (schema.pristype === PrisinformasjonType.Anskaffelse) {
      addPrisinformasjonIssue(
        ctx,
        'anskaffelse-totalbelop',
        'Du må fylle ut totalbeløp for anskaffelsen.'
      )
    }

    if (schema.pristype === PrisinformasjonType.Tilskudd) {
      addPrisinformasjonIssue(
        ctx,
        'tilskuddstype-checkbox',
        'Du må velge minst ett tilskudd.'
      )
    }

    if (schema.pristype === PrisinformasjonType.IngenKostnader) {
      addPrisinformasjonIssue(
        ctx,
        'ingen-kostnader-aarsak',
        'Du må velge årsaken til at det ikke er aktuelt med betaling eller refusjon fra Nav.'
      )
    }

    return
  }

  if (schema.prisinformasjon.type === PrisinformasjonType.Anskaffelse) {
    if (!schema.prisinformasjon.pris || schema.prisinformasjon.pris <= 0) {
      addPrisinformasjonIssue(
        ctx,
        'anskaffelse-totalbelop',
        'Du må fylle ut totalbeløp for anskaffelsen.'
      )
    } else if (schema.prisinformasjon.pris > PRISINFO_MAX_BELOP) {
      addPrisinformasjonIssue(
        ctx,
        'anskaffelse-totalbelop',
        `Totalbeløp for anskaffelsen kan ikke være mer enn ${PRISINFO_MAX_BELOP.toLocaleString('nb-NO')} kroner.`
      )
    }

    return
  }

  if (schema.prisinformasjon.type === PrisinformasjonType.Tilskudd) {
    const tilskudd = schema.prisinformasjon.tilskudd ?? []

    if (tilskudd.length === 0) {
      addPrisinformasjonIssue(
        ctx,
        'tilskuddstype-checkbox',
        'Du må velge minst ett tilskudd.'
      )
      return
    }

    tilskudd.forEach(({ type: tilskuddstype, pris: belop }) => {
      if (!(belop > 0)) {
        const navn = tilskuddstype.toLowerCase().replace(/_/g, ' ')
        addPrisinformasjonIssue(
          ctx,
          `pris-${tilskuddstype}`,
          `Du må fylle ut estimert totalbeløp for ${navn}.`
        )
      } else if (belop > PRISINFO_MAX_BELOP) {
        const navn = tilskuddstype.toLowerCase().replace(/_/g, ' ')
        addPrisinformasjonIssue(
          ctx,
          `pris-${tilskuddstype}`,
          `Pris for ${navn} kan ikke være mer enn ${PRISINFO_MAX_BELOP.toLocaleString('nb-NO')} kroner.`
        )
      }
    })

    if (
      (schema.prisinformasjon.tilleggsopplysninger?.length ?? 0) >
      PRISINFO_MAX_TEGN
    ) {
      addPrisinformasjonIssue(
        ctx,
        'tilleggsopplysninger-tilskudd',
        `Tilleggsopplysninger kan ikke ha mer enn ${PRISINFO_MAX_TEGN} tegn.`
      )
    }

    return
  }

  if (schema.prisinformasjon.type === PrisinformasjonType.IngenKostnader) {
    if (!schema.prisinformasjon.aarsak) {
      addPrisinformasjonIssue(
        ctx,
        'ingen-kostnader-aarsak',
        'Du må velge årsaken til at det ikke er aktuelt med betaling eller refusjon fra Nav.'
      )
      return
    }

    const tilleggsopplysninger =
      schema.prisinformasjon.tilleggsopplysninger ?? ''

    if (
      schema.prisinformasjon.aarsak ===
        IngenKostnaderAarsak.OPPLAERINGEN_ER_EGENFINANSIERT &&
      tilleggsopplysninger.trim().length === 0
    ) {
      addPrisinformasjonIssue(
        ctx,
        'tilleggsopplysninger-ingen-kostnader',
        'Du må fylle ut tilleggsopplysninger når bruker dekker opplæringen selv.'
      )
    }

    if (tilleggsopplysninger.length > PRISINFO_MAX_TEGN) {
      addPrisinformasjonIssue(
        ctx,
        'tilleggsopplysninger-ingen-kostnader',
        `Tilleggsopplysninger kan ikke ha mer enn ${PRISINFO_MAX_TEGN} tegn.`
      )
    }
  }
}
