import { z } from 'zod'

export enum OpplaringRepresenterer {
  KURSTYPE_ID = 'KURSTYPE_ID',
  BRANSJE_ID = 'BRANSJE_ID',
  SERTIFISERINGER = 'SERTIFISERINGER',
  FORERKORT = 'FORERKORT',
  INNHOLDSELEMENTER = 'INNHOLDSELEMENTER',
  NORSKPROVE = 'NORSKPROVE',
  UTDANNINGSPROGRAM_ID = 'UTDANNINGSPROGRAM_ID',
  LAREFAG = 'LAREFAG'
}

/**
 * Skjema for valgte sertifiseringer (Janzz-ID + visningsnavn).
 * Brukes både som del av det flate kodeverket og i full kodeverk-response.
 */
export const sertifiseringValgSchema = z.array(
  z.object({
    id: z.int(),
    navn: z.string()
  })
)

/**
 * Det flate ("utflatede") kodeverket som henger på en deltakerliste/deltaker.
 * Inneholder kun ferdig selekterte verdier som skal vises eller persisteres,
 * ikke hele hierarkiet av valg.
 */
export const utflatetKodeverkSchema = z.object({
  eleenter: z.array(
    z.object({
      representerer: z.enum(OpplaringRepresenterer),
      valg: z.array(
        z.object({
          id: z.string(),
          visningsnavn: z.string()
        })
      ) // TODO den er ikke helt slik i backend
    })
  ),
  valgteSertifiseringer: sertifiseringValgSchema
})

/*
export const utflatetKodeverkSchema = z.object({
  tiltakskode: z.enum(Tiltakskode),
  tittel: z.string().nullable(),
  valg: z.array(z.string()),
  valgteKodeverkIder: z.array(z.uuid()),
  valgteSertifiseringer: sertifiseringValgSchema
})
*/

export type FlattKodeverk = z.infer<typeof utflatetKodeverkSchema>
