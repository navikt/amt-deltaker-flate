import z from 'zod'

export enum PrisinformasjonType {
  Anskaffelse = 'Anskaffelse',
  Tilskudd = 'Tilskudd',
  IngenKostnader = 'IngenKostnader'
}

export enum Tilskuddstype {
  SKOLEPENGER = 'SKOLEPENGER',
  STUDIEREISE = 'STUDIEREISE',
  EKSAMENSGEBYR = 'EKSAMENSGEBYR',
  SEMESTERAVGIFT = 'SEMESTERAVGIFT',
  INTEGRERT_BOTILBUD = 'INTEGRERT_BOTILBUD'
}

export enum IngenKostnaderAarsak {
  OPPLAERINGEN_ER_KOSTNADSFRI = 'OPPLAERINGEN_ER_KOSTNADSFRI',
  OPPLAERINGEN_ER_EGENFINANSIERT = 'OPPLAERINGEN_ER_EGENFINANSIERT'
}

export const anskaffelseSchema = z.object({
  type: z.literal(PrisinformasjonType.Anskaffelse),
  pris: z.number().int()
})

export const tilskuddSchema = z.object({
  type: z.literal(PrisinformasjonType.Tilskudd),
  tilskudd: z.record(z.enum(Tilskuddstype), z.number().int()),
  tilleggsopplysninger: z.string().nullish()
})

export const ingenKostnaderSchema = z.object({
  type: z.literal(PrisinformasjonType.IngenKostnader),
  aarsak: z.enum(IngenKostnaderAarsak),
  tilleggsopplysninger: z.string().nullish()
})

export const prisinformasjonSchema = z.discriminatedUnion('type', [
  anskaffelseSchema,
  tilskuddSchema,
  ingenKostnaderSchema
])

export type Prisinformasjon = z.infer<typeof prisinformasjonSchema>
