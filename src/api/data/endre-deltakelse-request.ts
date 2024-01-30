import { z } from 'zod'
import { DeltakerStatusAarsakType } from './pamelding'

export enum EndreDeltakelseType {
  IKKE_AKTUELL = 'IKKE_AKTUELL',
  ENDRE_INNHOLD = 'ENDRE_INNHOLD',
  ENDRE_BAKGRUNNSINFO = 'ENDRE_BAKGRUNNSINFO',
  ENDRE_SLUTTARSAK = 'ENDRE_SLUTTARSAK',
  ENDRE_SLUTTDATO = 'ENDRE_SLUTTDATO',
  ENDRE_OPPSTARTSDATO = 'ENDRE_OPPSTARTSDATO',
  FORLENG_DELTAKELSE = 'FORLENG_DELTAKELSE',
  AVSLUTT_DELTAKELSE = 'AVSLUTT_DELTAKELSE'
}

export const aarsakSchema = z.object({
  type: z.nativeEnum(DeltakerStatusAarsakType),
  beskrivelse: z.string().nullable()
})

export const ikkeAktuellSchema = z.object({
  aarsak: aarsakSchema
})

export type IkkeAktuellRequest = z.infer<typeof ikkeAktuellSchema>
