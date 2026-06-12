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
  valgteKategoriseringer: z.array(
    z.object({
      representerer: z.enum(OpplaringRepresenterer),
      valg: z.record(z.uuid(), z.string()).transform((valgMap) =>
        Object.entries(valgMap).map(([id, visningsnavn]) => ({
          id,
          visningsnavn
        }))
      )
    })
  ),
  valgteSertifiseringer: sertifiseringValgSchema
})

export type FlattKodeverk = z.infer<typeof utflatetKodeverkSchema>
