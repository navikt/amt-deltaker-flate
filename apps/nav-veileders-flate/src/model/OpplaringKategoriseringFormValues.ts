import { OpplaringRepresenterer } from 'deltaker-flate-common'
import { z } from 'zod'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import {
  OpplaringKategoriseringAlternativType,
  KodeverkContainer,
  KodeverkResponse,
  KodeverkUtdanningGruppe,
  KodeverkVerdigruppeBase
} from '../api/data/kodeverk.ts'
import {
  getValgteSertifiseringer,
  getValgteVerdier
} from '../utils/kodeverk.ts'
import { getInnholdAnnetBeskrivelse } from './PameldingFormValues.ts'

export const INNHOLD_MAX_TEGN = 250

export const innholdFormSchema = z
  .string()
  .min(1, 'Innholdet til kurset er påkrevd.')
  .max(
    INNHOLD_MAX_TEGN,
    `Innholdet til kurset kan ikke ha mer enn ${INNHOLD_MAX_TEGN} tegn.`
  )

export const kategoriseringValgSchema = z.array(
  z.object({
    representerer: z.enum(OpplaringRepresenterer),
    valgteIder: z.array(z.string())
  })
)

export const sertifiseringValgSchema = z.array(
  z.object({ id: z.number(), navn: z.string() })
)

export const createOpplaringKategoriseringFormSchema = (
  kodeverk?: KodeverkResponse
) =>
  z
    .object({
      kategoriseringValg: kategoriseringValgSchema,
      sertifiseringValg: sertifiseringValgSchema,
      innhold: innholdFormSchema
    })
    .superRefine((schema, ctx) => {
      if (!kodeverk) {
        return
      }

      validateKodeverkAlternativer(kodeverk.alternativer, schema, ctx)
    })

export type OpplaringKategoriseringFormValues = z.infer<
  ReturnType<typeof createOpplaringKategoriseringFormSchema>
>

export const generateKodeverkDefaultValues = (
  deltaker: DeltakerResponse
): OpplaringKategoriseringFormValues => {
  return {
    kategoriseringValg: getValgteVerdier(
      deltaker.deltakerliste.opplaringKategoriseringValg
    ),
    sertifiseringValg: getValgteSertifiseringer(
      deltaker.deltakerliste.opplaringKategoriseringValg
    ),
    innhold: getInnholdAnnetBeskrivelse(deltaker) ?? ''
  }
}

export const validateKodeverkAlternativer = (
  alternativer: KodeverkContainer[],
  schema: OpplaringKategoriseringFormValues,
  ctx: z.RefinementCtx
) => {
  alternativer.forEach((alternativ) => {
    if (alternativ.type === OpplaringKategoriseringAlternativType.VERDIGRUPPE) {
      validateVerdigruppe(alternativ, schema, ctx)
      return
    }

    if (
      alternativ.type === OpplaringKategoriseringAlternativType.UTDANNING_GRUPPE
    ) {
      validateUtdanningsgruppe(alternativ, schema, ctx)
      return
    }

    if (
      alternativ.type === OpplaringKategoriseringAlternativType.VERDIGRUPPE_SOK
    ) {
      return
    }
  })
}

const validateVerdigruppe = (
  alternativ: KodeverkVerdigruppeBase,
  schema: OpplaringKategoriseringFormValues,
  ctx: z.RefinementCtx
) => {
  if (!alternativ.pakrevd) {
    return
  }

  const valgtIder = schema.kategoriseringValg
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
  schema: OpplaringKategoriseringFormValues,
  ctx: z.RefinementCtx
) => {
  if (!alternativ.pakrevd) {
    return
  }

  const valgtIder = schema.kategoriseringValg
    .filter((valg) => valg.representerer === alternativ.representerer)
    .flatMap((valg) => valg.valgteIder)

  if (valgtIder.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: `${alternativ.visningsnavn} er påkrevd.`,
      path: [`kodeverkValg_${alternativ.representerer}`]
    })
  }

  const valgtUtdanning = alternativ.utdanninger.find((u) =>
    valgtIder.includes(u.id)
  )
  if (valgtUtdanning) {
    validateVerdigruppe(valgtUtdanning.larefag, schema, ctx)
  }
}
