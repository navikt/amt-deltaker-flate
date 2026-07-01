import {
  OpplaringKategorisering,
  OpplaringRepresenterer
} from '../model/kodeverk'

/**
 * Oppretter en mock OpplaringKategorisering (det flate formatet).
 * Brukes i historikk-mock og andre steder som trenger ferdig-utflatet data.
 */
export const lagOpplaringKategoriseringMockRespons =
  (): OpplaringKategorisering => ({
    valgteKategoriseringer: [
      {
        type: OpplaringRepresenterer.BRANSJE_ID,
        valgteElementer: [
          {
            id: 'e6749d6c-aacf-452d-baf2-d5fb5021912b',
            visningsnavn: 'Butikk- og salgsarbeid'
          }
        ]
      },
      {
        type: OpplaringRepresenterer.FORERKORT,
        valgteElementer: [
          {
            id: '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c',
            visningsnavn: 'B - Personbil'
          },
          {
            id: 'e3fcf1f7-1f20-4fca-bad5-422b7ee0418f',
            visningsnavn: 'C - Lastebil'
          }
        ]
      }
    ],
    valgteSertifiseringer: [{ id: 3, navn: 'Sertifisert zumba-instruktør' }]
  })
