import {
  erOpplaringstiltak,
  getMockKodeverkResponse,
  mockSertifiseringer,
  type OpplaringKategorisering,
  Tiltakskode,
  toOpplaringKategorisering
} from 'deltaker-flate-common'

export {
  mockSertifiseringer,
  getMockKodeverkResponse as createMockKodeverkResponse,
  toOpplaringKategorisering
}

export const createMockFlatKodeverk = (
  tiltakskode: Tiltakskode,
  erEnkeltplass: boolean
): OpplaringKategorisering | null => {
  if (!erOpplaringstiltak(tiltakskode) || !erEnkeltplass) {
    return null
  }
  return toOpplaringKategorisering(getMockKodeverkResponse(tiltakskode))
}
