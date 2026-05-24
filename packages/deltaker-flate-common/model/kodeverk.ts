import { z } from 'zod'

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
  tittel: z.string().nullable(),
  valg: z.array(z.string()),
  valgteKodeverkIder: z.array(z.uuid()),
  valgteSertifiseringer: sertifiseringValgSchema
})

export type FlattKodeverk = z.infer<typeof utflatetKodeverkSchema>
