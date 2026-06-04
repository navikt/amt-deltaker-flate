import { FlattKodeverk, OpplaringRepresenterer } from 'deltaker-flate-common'

export const createMockFlatKodeverk = (): FlattKodeverk => {
  return {
    valgteKategoriseringer: [
      {
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        valg: [
          {
            id: '14886bad-a495-420a-9bae-d33e2d88041f',
            visningsnavn: 'Butikk- og salgsarbeid'
          }
        ]
      },
      {
        representerer: OpplaringRepresenterer.FORERKORT,
        valg: [
          {
            id: '14886bad-a495-420a-9bae-d33e2d88041a',
            visningsnavn: 'B - Personbil'
          },
          {
            id: '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c',
            visningsnavn: 'C - Lastebil'
          }
        ]
      }
    ],
    valgteSertifiseringer: [{ id: 3, navn: 'Sertifisert zumba-instruktør' }]
  }
}
