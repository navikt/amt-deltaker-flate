import { z } from 'zod'
import { dateSchema, nullableDateSchema } from './utils'

export enum Oppstartstype {
  LOPENDE = 'LOPENDE',
  FELLES = 'FELLES'
}

export enum Tiltakskode {
  ARBEIDSFORBEREDENDE_TRENING = 'ARBEIDSFORBEREDENDE_TRENING',
  ARBEIDSRETTET_REHABILITERING = 'ARBEIDSRETTET_REHABILITERING',
  AVKLARING = 'AVKLARING',
  DIGITALT_OPPFOLGINGSTILTAK = 'DIGITALT_OPPFOLGINGSTILTAK',
  GRUPPE_ARBEIDSMARKEDSOPPLAERING = 'GRUPPE_ARBEIDSMARKEDSOPPLAERING',
  GRUPPE_FAG_OG_YRKESOPPLAERING = 'GRUPPE_FAG_OG_YRKESOPPLAERING',
  JOBBKLUBB = 'JOBBKLUBB',
  OPPFOLGING = 'OPPFOLGING',
  VARIG_TILRETTELAGT_ARBEID_SKJERMET = 'VARIG_TILRETTELAGT_ARBEID_SKJERMET',

  // Enkeltplasser gammel forskrift (kun import fra Arena):
  HOYERE_UTDANNING = 'HOYERE_UTDANNING',
  ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING = 'ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING',
  ENKELTPLASS_FAG_OG_YRKESOPPLAERING = 'ENKELTPLASS_FAG_OG_YRKESOPPLAERING'
}

export enum DeltakerStatusType {
  KLADD = 'KLADD',
  UTKAST_TIL_PAMELDING = 'UTKAST_TIL_PAMELDING',
  AVBRUTT_UTKAST = 'AVBRUTT_UTKAST',
  VENTER_PA_OPPSTART = 'VENTER_PA_OPPSTART',
  DELTAR = 'DELTAR',
  HAR_SLUTTET = 'HAR_SLUTTET',
  IKKE_AKTUELL = 'IKKE_AKTUELL',
  FEILREGISTRERT = 'FEILREGISTRERT',
  SOKT_INN = 'SOKT_INN',
  VURDERES = 'VURDERES',
  VENTELISTE = 'VENTELISTE',
  AVBRUTT = 'AVBRUTT',
  FULLFORT = 'FULLFORT',
  PABEGYNT_REGISTRERING = 'PABEGYNT_REGISTRERING'
}

export enum DeltakerStatusAarsakType {
  SYK = 'SYK',
  FATT_JOBB = 'FATT_JOBB',
  TRENGER_ANNEN_STOTTE = 'TRENGER_ANNEN_STOTTE',
  UTDANNING = 'UTDANNING',
  IKKE_MOTT = 'IKKE_MOTT',
  ANNET = 'ANNET',
  FIKK_IKKE_PLASS = 'FIKK_IKKE_PLASS',
  SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT = 'SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT',
  KURS_FULLT = 'KURS_FULLT',
  KRAV_IKKE_OPPFYLT = 'KRAV_IKKE_OPPFYLT',
  AVLYST_KONTRAKT = 'AVLYST_KONTRAKT'
}

export enum DeltakerlisteStatus {
  PLANLAGT = 'PLANLAGT',
  GJENNOMFORES = 'GJENNOMFORES',
  AVBRUTT = 'AVBRUTT',
  AVLYST = 'AVLYST',
  AVSLUTTET = 'AVSLUTTET'
}

export enum Vurderingstype {
  OPPFYLLER_KRAVENE = 'OPPFYLLER_KRAVENE',
  OPPFYLLER_IKKE_KRAVENE = 'OPPFYLLER_IKKE_KRAVENE'
}

export const deltakerStatusAarsakSchema = z.object({
  type: z.enum(DeltakerStatusAarsakType),
  beskrivelse: z.string().nullable()
})

export const vedtaksinformasjonSchema = z.object({
  fattet: nullableDateSchema,
  fattetAvNav: z.boolean(),
  opprettet: dateSchema,
  opprettetAv: z.string(),
  sistEndret: dateSchema,
  sistEndretAv: z.string(),
  sistEndretAvEnhet: z.string().nullable()
})

export const innholdSchema = z.object({
  tekst: z.string(),
  innholdskode: z.string(),
  valgt: z.boolean(),
  beskrivelse: z.string().nullable()
})

export const deltakelsesinnholdSchema = z.object({
  ledetekst: z.string().nullable(),
  innhold: z.array(innholdSchema)
})

export const pameldingStatusSchema = z.object({
  id: z.uuid(),
  type: z.enum(DeltakerStatusType),
  aarsak: deltakerStatusAarsakSchema.nullable(),
  gyldigFra: dateSchema,
  gyldigTil: nullableDateSchema,
  opprettet: dateSchema
})

export const importertDeltakerFraArenaSchema = z.object({
  innsoktDato: dateSchema
})

export const deltakelsesmengdeSchema = z.object({
  deltakelsesprosent: z.number(),
  dagerPerUke: z.number().nullable(),
  gyldigFra: dateSchema
})

export const deltakelsesmengderSchema = z.object({
  nesteDeltakelsesmengde: deltakelsesmengdeSchema.nullable(),
  sisteDeltakelsesmengde: deltakelsesmengdeSchema.nullable()
})

export type Vedtaksinformasjon = z.infer<typeof vedtaksinformasjonSchema>
export type DeltakerStatusAarsak = z.infer<typeof deltakerStatusAarsakSchema>
export type Innhold = z.infer<typeof innholdSchema>
export type Deltakelsesinnhold = z.infer<typeof deltakelsesinnholdSchema>
export type DeltakerStatus = z.infer<typeof pameldingStatusSchema>
export type importertDeltakerFraArena = z.infer<
  typeof importertDeltakerFraArenaSchema
>
export type Deltakelsesmengde = z.infer<typeof deltakelsesmengdeSchema>
