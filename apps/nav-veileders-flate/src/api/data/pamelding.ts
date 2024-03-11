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
  // UTDANNING = 'UTDANNING', TODO denne er ny og ikke støttet av backend enda
  IKKE_MOTT = 'IKKE_MOTT',
  ANNET = 'ANNET'
  // TODO Feilregistrert
}

export const tiltakstypeSchema = z.nativeEnum(Tiltakstype)
export const deltakerStaturTypeSchema = z.nativeEnum(DeltakerStatusType)
export const deltakerStatusAarsakTypeSchema = z.nativeEnum(DeltakerStatusAarsakType)

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

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  deltakerlisteNavn: z.string(),
  tiltakstype: tiltakstypeSchema,
  arrangorNavn: z.string(),
  oppstartstype: z.string(),
  startdato: z.string(),
  sluttdato: z.string().nullable()
})

export const deltakerStatusAarsakSchema = z.object({
  type: deltakerStatusAarsakTypeSchema,
  beskrivelse: z.string().nullable()
})

export const pameldingStatusSchema = z.object({
  id: z.string().uuid(),
  type: deltakerStaturTypeSchema,
  aarsak: deltakerStatusAarsakSchema.nullable(),
  gyldigFra: z.string(),
  gyldigTil: z.string().nullable(),
  opprettet: z.string()
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

export const pameldingSchema = z.object({
  deltakerId: z.string().uuid(),
  fornavn: z.string(),
  mellomnavn: z.string().nullable(),
  etternavn: z.string(),
  deltakerliste: deltakerlisteSchema,
  status: pameldingStatusSchema,
  startdato: z.string().nullable(),
  sluttdato: z.string().nullable(),
  dagerPerUke: z.number().nullable(),
  deltakelsesprosent: z.number().nullable(),
  bakgrunnsinformasjon: z.string().nullable(),
  deltakelsesinnhold: deltakelsesinnholdSchema.nullable(),
  vedtaksinformasjon: vedtaksinformasjonSchema.nullable()
})

export type Vedtaksinformasjon = z.infer<typeof vedtaksinformasjonSchema>
export type DeltakerStatusAarsak = z.infer<typeof deltakerStatusAarsakSchema>
export type xInnhold = z.infer<typeof innholdSchema>
export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type PameldingResponse = z.infer<typeof pameldingSchema>
export type Deltakelsesinnhold = z.infer<typeof deltakelsesinnholdSchema>
