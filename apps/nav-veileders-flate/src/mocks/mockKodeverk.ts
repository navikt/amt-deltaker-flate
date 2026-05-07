import {
  KodeverkAlternativType,
  KodeverkResponse,
  Seleksjonstype
} from '../api/data/kodeverk'

export const createMockKodeverkResponse = (): KodeverkResponse => {
  return {
    tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
    alternativer: [
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        id: 'a1b2c3d4-e5f6-4789-9abc-def012345678',
        visningsnavn: 'Førerkortklasse',
        representerer: 'forerkortklasse',
        seleksjonstype: Seleksjonstype.FLERVALG,
        alternativer: [
          {
            type: KodeverkAlternativType.VERDI,
            id: 'b2c3d4e5-f6a7-4890-9bcd-ef0123456789',
            visningsnavn: 'B',
            valgt: true
          },
          {
            type: KodeverkAlternativType.VERDI,
            id: 'c3d4e5f6-a7b8-4901-9cde-f01234567890',
            visningsnavn: 'C1',
            valgt: false
          },
          {
            type: KodeverkAlternativType.VERDI,
            id: 'd4e5f6a7-b8c9-4012-9def-012345678901',
            visningsnavn: 'CE',
            valgt: false
          }
        ]
      },
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        id: 'a1b2c3d4-e5f6-4789-9abc-def012345679',
        visningsnavn: 'Sertifisering',
        representerer: 'sertifisering',
        seleksjonstype: Seleksjonstype.ENKELTVALG,
        alternativer: [
          {
            type: KodeverkAlternativType.VERDI,
            id: 'b2c3d4e5-f6a7-4890-9bcd-ef0123456788',
            visningsnavn: 'Hekling',
            valgt: false
          },
          {
            type: KodeverkAlternativType.VERDI,
            id: 'c3d4e5f6-a7b8-4901-9cde-f01234567891',
            visningsnavn: 'Makrame',
            valgt: false
          },
          {
            type: KodeverkAlternativType.VERDI,
            id: 'd4e5f6a7-b8c9-4012-9def-012345678900',
            visningsnavn: 'Origami',
            valgt: false
          }
        ]
      }
    ]
  }
}
