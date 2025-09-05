import {
  dateSchema,
  deltakerStatusAarsakSchema,
  forslagEndringSchema,
  UlestHendelseType
} from 'deltaker-flate-common'
import z from 'zod'

const innbyggerGodkjennUtkastSchema = z.object({
  type: z.literal(UlestHendelseType.InnbyggerGodkjennUtkast)
})
const navGodkjennUtkastSchema = z.object({
  type: z.literal(UlestHendelseType.NavGodkjennUtkast)
})
const reaktiverDeltakelseSchema = z.object({
  type: z.literal(UlestHendelseType.ReaktiverDeltakelse),
  begrunnelseFraNav: z.string()
})

const ikkeAktuellSchema = z.object({
  type: z.literal(UlestHendelseType.IkkeAktuell),
  aarsak: deltakerStatusAarsakSchema,
  begrunnelseFraNav: z.string().nullable(),
  begrunnelseFraArrangor: z.string().nullable(),
  endringFraForslag: forslagEndringSchema.nullable()
})

const avsluttDeltakelseSchema = z.object({
  type: z.literal(UlestHendelseType.AvsluttDeltakelse),
  aarsak: deltakerStatusAarsakSchema.nullable(),
  sluttdato: dateSchema,
  begrunnelseFraNav: z.string().nullable(),
  begrunnelseFraArrangor: z.string().nullable(),
  endringFraForslag: forslagEndringSchema.nullable()
})

const avbrytDeltakelseSchema = z.object({
  type: z.literal(UlestHendelseType.AvbrytDeltakelse),
  aarsak: deltakerStatusAarsakSchema.nullable(),
  sluttdato: dateSchema,
  begrunnelseFraNav: z.string().nullable(),
  begrunnelseFraArrangor: z.string().nullable(),
  endringFraForslag: forslagEndringSchema.nullable()
})

export const hendelseSchema = z.discriminatedUnion('type', [
  innbyggerGodkjennUtkastSchema,
  navGodkjennUtkastSchema,
  reaktiverDeltakelseSchema,
  ikkeAktuellSchema,
  avsluttDeltakelseSchema,
  avbrytDeltakelseSchema
])

export const hendelseAnsvarligSchema = z.object({
  endretAvNavn: z.string(),
  endretAvEnhet: z.string().nullable()
})

export const ulesthendelseSchema = z.object({
  id: z.string().uuid(),
  opprettet: dateSchema,
  deltakerId: z.string().uuid(),
  ansvarlig: hendelseAnsvarligSchema.nullable(),
  hendelse: hendelseSchema
})

export type UlestHendelse = z.infer<typeof ulesthendelseSchema>
export type UlestHendelseEndring = z.infer<typeof hendelseSchema>
