import {
  IngenKostnaderAarsak,
  prisinformasjonSchema,
  PrisinformasjonType
} from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/deltaker.ts'

export const PRISINFO_MAX_TEGN = 600
const PRISINFO_MAX_BELOP = 10_000_000

export const createPrisinformasjonFormSchema = () =>
  z
    .object({
      pristype: z.enum(PrisinformasjonType).nullable(),
      prisinformasjon: prisinformasjonSchema.nullable()
    })
    .refine((schema) => schema.pristype !== null, {
      message: 'Du må velge et alternativ for Navs kostnader.',
      path: ['pristype']
    })
    .superRefine((schema, ctx) => {
      validatePrisinformasjon(schema, ctx)
    })

export type PrisinformasjonFormValues = z.infer<
  ReturnType<typeof createPrisinformasjonFormSchema>
>

export const generatePrisinformasjonDefaultValues = (
  deltaker: DeltakerResponse
): PrisinformasjonFormValues => {
  return {
    pristype: deltaker.deltakerliste.prisinformasjon?.type ?? null,
    prisinformasjon: deltaker.deltakerliste.prisinformasjon ?? null
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

export const validatePrisinformasjon = (
  schema: {
    pristype: PrisinformasjonType | null
    prisinformasjon: z.infer<typeof prisinformasjonSchema> | null
  },
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
        'Du må fylle ut tilleggsopplysninger om egenfinansieringen.'
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
