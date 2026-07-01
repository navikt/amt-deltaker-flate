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
const valgtElementSchema = z.object({
  id: z.uuid(),
  visningsnavn: z.string()
})
export const opplaringKategoriseringSchema = z.object({
  valgteKategoriseringer: z.array(
    z.object({
      type: z.enum(OpplaringRepresenterer),
      valgteElementer: z.array(valgtElementSchema)
    })
  ),
  valgteSertifiseringer: sertifiseringValgSchema
})

export type OpplaringKategorisering = z.infer<
  typeof opplaringKategoriseringSchema
>
export type ValgtKategoriseringElement = z.infer<typeof valgtElementSchema>
