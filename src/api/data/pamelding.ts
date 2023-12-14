import {z} from 'zod'

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

export const tiltakstypeSchema = z.nativeEnum(Tiltakstype)

export const malSchema = z.object({
  visningstekst: z.string(), // kommer fra valp
  type: z.string(), // Enum/String, kommer fra valp
  valgt: z.boolean(),
  beskrivelse: z.string().nullable()
})

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  deltakerlisteNavn: z.string(),
  tiltakstype: tiltakstypeSchema,
  arrangorNavn: z.string(),
  oppstartstype: z.string()
})

export const pameldingStatusSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  aarsak: z.string().nullable(),
  gyldigFra: z.date(),
  gyldigTil: z.date().nullable(),
  opprettet: z.date()
})

export const pameldingSchema = z.object({
  deltakerId: z.string().uuid(),
  deltakerliste: deltakerlisteSchema,
  status: pameldingStatusSchema,
  startdato: z.date().nullable(),
  sluttdato: z.date().nullable(),
  dagerPerUke: z.number().nullable(),
  deltakelsesprosent: z.number().nullable(),
  bakgrunnsinformasjon: z.string().nullable(),
  mal: z.array(malSchema),
  sistEndretAv: z.string()
})

export type Mal = z.infer<typeof malSchema>
export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type PameldingResponse = z.infer<typeof pameldingSchema>
