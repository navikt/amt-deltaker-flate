import z from 'zod'

export enum PrisinformasjonType {
  Anskaffelse = 'Anskaffelse',
  Tilskudd = 'Tilskudd',
  IngenKostnader = 'IngenKostnader'
}

export enum Tilskuddstype {
  SKOLEPENGER = 'SKOLEPENGER',
  SEMESTERAVGIFT = 'SEMESTERAVGIFT',
  EKSAMENSGEBYR = 'EKSAMENSGEBYR',
  STUDIEREISE = 'STUDIEREISE',
  INTEGRERT_BOTILBUD = 'INTEGRERT_BOTILBUD'
}

export const anskaffelseSchema = z.object({
  type: z.literal(PrisinformasjonType.Anskaffelse),
  pris: z.int(),
  begrunnelse: z.string().nullish()
})

export const tilskuddSchema = z.object({
  type: z.literal(PrisinformasjonType.Tilskudd),
  tilskudd: z.array(
    z.object({
      type: z.enum(Tilskuddstype),
      pris: z.int()
    })
  ),
  tilleggsopplysninger: z.string().nullish(),
  begrunnelse: z.string().nullish()
})

export const ingenKostnaderSchema = z.object({
  type: z.literal(PrisinformasjonType.IngenKostnader),
  tilleggsopplysninger: z.string(),
  begrunnelse: z.string().nullish()
})

export const prisinformasjonSchema = z.discriminatedUnion('type', [
  anskaffelseSchema,
  tilskuddSchema,
  ingenKostnaderSchema
])

export type Prisinformasjon = z.infer<typeof prisinformasjonSchema>
