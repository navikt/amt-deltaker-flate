import {
  OpplaringKategorisering,
  OpplaringRepresenterer
} from 'deltaker-flate-common'

type FlattKodeverkWire = Omit<
  OpplaringKategorisering,
  'valgteKategoriseringer'
> & {
  valgteKategoriseringer: Array<{
    representerer: OpplaringRepresenterer
    valg: Record<string, string>
  }>
}

export const createMockFlatKodeverk = (): FlattKodeverkWire => {
  return {
    valgteKategoriseringer: [
      {
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        valg: {
          '14886bad-a495-420a-9bae-d33e2d88041f': 'Butikk- og salgsarbeid'
        }
      },
      {
        representerer: OpplaringRepresenterer.FORERKORT,
        valg: {
          '14886bad-a495-420a-9bae-d33e2d88041a': 'B - Personbil',
          '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c': 'C - Lastebil'
        }
      }
    ],
    valgteSertifiseringer: [{ id: 3, navn: 'Sertifisert zumba-instruktør' }]
  }
}
