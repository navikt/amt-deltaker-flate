import {
  erOpplaringstiltak,
  lagOpplaringKategoriseringForTiltak,
  mockSertifiseringer,
  type OpplaringKategorisering,
  Tiltakskode,
  toOpplaringKategorisering
} from 'deltaker-flate-common'

export {
  mockSertifiseringer,
  lagOpplaringKategoriseringForTiltak as createMockKodeverkResponse,
  toOpplaringKategorisering
}

export const createMockFlatKodeverk = (
  tiltakskode: Tiltakskode,
  erEnkeltplass: boolean
): OpplaringKategorisering | null => {
  if (!erOpplaringstiltak(tiltakskode) || !erEnkeltplass) {
    return null
  }
  return toOpplaringKategorisering(
    lagOpplaringKategoriseringForTiltak(tiltakskode)
  )
}
