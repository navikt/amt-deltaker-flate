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
  visningsTekst: z.string(), // kommer fra valp
  type: z.string(), // Enum/String, kommer fra valp
  valgt: z.boolean(),
  beskrivelse: z.string().nullable()
})

export const deltakerlisteSchema = z.object({
  deltakerlisteId: z.string().uuid(),
  deltakerlisteNavn: z.string(),
  tiltakstype: tiltakstypeSchema,
  arrangorNavn: z.string(),
  oppstartstype: z.string(),
  mal: z.array(malSchema)
})

export const pameldingSchema = z.object({
  deltakerId: z.string().uuid(),
  deltakerliste: deltakerlisteSchema
})

export type Mal = z.infer<typeof malSchema>
export type Deltakerliste = z.infer<typeof deltakerlisteSchema>
export type PameldingResponse = z.infer<typeof pameldingSchema>
