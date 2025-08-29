import {
  dateSchema,
  deltakerStatusAarsakSchema,
  forslagEndringSchema,
  nullableDateSchema
} from 'deltaker-flate-common'
import z from 'zod'

export enum UlestHendelseType {
  InnbyggerGodkjennUtkast = 'InnbyggerGodkjennUtkast',
  NavGodkjennUtkast = 'NavGodkjennUtkast',
  LeggTilOppstartsdato = 'LeggTilOppstartsdato',
  FjernOppstartsdato = 'FjernOppstartsdato',
  EndreStartdato = 'EndreStartdato',
  IkkeAktuell = 'IkkeAktuell',
  AvsluttDeltakelse = 'AvsluttDeltakelse',
  AvbrytDeltakelse = 'AvbrytDeltakelse',
  ReaktiverDeltakelse = 'ReaktiverDeltakelse'
}

const innbyggerGodkjennUtkastSchema = z.object({
  type: z.literal(UlestHendelseType.InnbyggerGodkjennUtkast)
})
const navGodkjennUtkastSchema = z.object({
  type: z.literal(UlestHendelseType.NavGodkjennUtkast)
})
const leggTilOppstartsdatoSchema = z.object({
  type: z.literal(UlestHendelseType.LeggTilOppstartsdato),
  startdato: dateSchema,
  sluttdato: nullableDateSchema
})

const fjernOppstartsdatoSchema = z.object({
  type: z.literal(UlestHendelseType.FjernOppstartsdato),
  begrunnelseFraNav: z.string().nullable(),
  begrunnelseFraArrangor: z.string().nullable(),
  endringFraForslag: forslagEndringSchema.nullable()
})

const endreStartdatoSchema = z.object({
  type: z.literal(UlestHendelseType.EndreStartdato),
  startdato: dateSchema,
  sluttdato: nullableDateSchema,
  begrunnelseFraNav: z.string().nullable(),
  begrunnelseFraArrangor: z.string().nullable(),
  endringFraForslag: forslagEndringSchema.nullable()
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

const reaktiverDeltakelseSchema = z.object({
  type: z.literal(UlestHendelseType.ReaktiverDeltakelse),
  begrunnelseFraNav: z.string()
})

export const hendelseSchema = z.discriminatedUnion('type', [
  innbyggerGodkjennUtkastSchema,
  navGodkjennUtkastSchema,
  leggTilOppstartsdatoSchema,
  fjernOppstartsdatoSchema,
  endreStartdatoSchema,
  ikkeAktuellSchema,
  avsluttDeltakelseSchema,
  avbrytDeltakelseSchema,
  reaktiverDeltakelseSchema
])

export const hendelseAnsvarligSchema = z.object({
  endretAvNavn: z.string().nullable(),
  endretAvEnhet: z.string().nullable()
})

export const ulesthendelseSchema = z.object({
  id: z.string().uuid(),
  opprettet: dateSchema,
  deltakerId: z.string().uuid(),
  ansvarlig: hendelseAnsvarligSchema,
  hendelse: hendelseSchema
})

export type UlestHendelse = z.infer<typeof ulesthendelseSchema>
export type UlestHendelseEndring = z.infer<typeof hendelseSchema>
