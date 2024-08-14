import { z } from 'zod'

export enum Tiltakstype {
  ARBFORB = 'ARBFORB', // Arbeidsforberedende trening / AFT
  ARBRRHDAG = 'ARBRRHDAG', // Arbeidsrettet rehabilitering / ARR
  AVKLARAG = 'AVKLARAG', // Avklaring
  INDOPPFAG = 'INDOPPFAG', // Oppfølging
  DIGIOPPARB = 'DIGIOPPARB', // Digitalt oppfølgingstiltak
  GRUFAGYRKE = 'GRUFAGYRKE', // Fag og yrkesopplæring gruppe / er kurs
  GRUPPEAMO = 'GRUPPEAMO', // Arbeidsmarkedsopplæring i gruppe / er kurs
  JOBBK = 'JOBBK', // Jobbklubb / er kurs
  VASV = 'VASV' // Varig tilrettelagt arbeid (skjermet virksomhet) / VTA
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
  SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT = 'SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT'
}

export enum DeltakerlisteStatus {
  PLANLAGT = 'PLANLAGT',
  GJENNOMFORES = 'GJENNOMFORES',
  AVBRUTT = 'AVBRUTT',
  AVLYST = 'AVLYST',
  AVSLUTTET = 'AVSLUTTET'
}

export const tiltakstypeSchema = z.nativeEnum(Tiltakstype)
export const deltakerStatusTypeSchema = z.nativeEnum(DeltakerStatusType)
export const deltakerStatusAarsakTypeSchema = z.nativeEnum(
  DeltakerStatusAarsakType
)

export const stringToDate = z.string().pipe(z.coerce.date())

export const deltakerStatusAarsakSchema = z.object({
  type: deltakerStatusAarsakTypeSchema,
  beskrivelse: z.string().nullable()
})

export const vedtaksinformasjonSchema = z.object({
  fattet: z.string().nullable(), // LocalDateTime
  fattetAvNav: z.boolean(),
  opprettet: z.string(),
  opprettetAv: z.string(),
  sistEndret: z.string(),
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
  ledetekst: z.string(),
  innhold: z.array(innholdSchema)
})

export const pameldingStatusSchema = z.object({
  id: z.string().uuid(),
  type: deltakerStatusTypeSchema,
  aarsak: deltakerStatusAarsakSchema.nullable(),
  gyldigFra: stringToDate,
  gyldigTil: stringToDate.nullable(),
  opprettet: stringToDate
})

export type Vedtaksinformasjon = z.infer<typeof vedtaksinformasjonSchema>
export type DeltakerStatusAarsak = z.infer<typeof deltakerStatusAarsakSchema>
export type Innhold = z.infer<typeof innholdSchema>
export type Deltakelsesinnhold = z.infer<typeof deltakelsesinnholdSchema>
