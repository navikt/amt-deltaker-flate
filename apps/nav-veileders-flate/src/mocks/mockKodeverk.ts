import { KodeverkResponse } from '../api/data/kodeverk'

export const createMockKodeverkResponse = (): KodeverkResponse => {
  return {
    tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
    alternativer: [
      {
        type: 'Verdigruppe',
        id: 'a1b2c3d4-e5f6-4789-9abc-def012345678',
        visningsnavn: 'Førerkortklasse',
        seleksjonstype: 'ENKELTVALG',
        obligatorisk: true,
        alternativer: [
          {
            type: 'Verdi',
            id: 'b2c3d4e5-f6a7-4890-9bcd-ef0123456789',
            visningsnavn: 'B',
            valgt: true
          },
          {
            type: 'Verdi',
            id: 'c3d4e5f6-a7b8-4901-9cde-f01234567890',
            visningsnavn: 'C1',
            valgt: false
          },
          {
            type: 'Verdi',
            id: 'd4e5f6a7-b8c9-4012-9def-012345678901',
            visningsnavn: 'CE',
            valgt: false
          }
        ]
      }
    ]
  }
}
