import { v4 as uuidv4 } from 'uuid'
import { KodeverkResponse } from '../api/data/kodeverk'

export const createMockKodeverkResponse = (): KodeverkResponse => {
  return {
    tiltakskode: 'ARBEIDSFORBEREDENDE_TRENING',
    alternativer: [
      {
        type: 'Gruppe',
        id: uuidv4(),
        visningsnavn: 'Yrkesrettede kvalifikasjoner',
        alternativer: [
          {
            type: 'Verdigruppe',
            id: uuidv4(),
            visningsnavn: 'Bransje',
            seleksjonstype: 'FLERVALG',
            alternativer: [
              {
                type: 'Verdi',
                id: uuidv4(),
                visningsnavn: 'Bygg og anlegg',
                valgt: true
              },
              {
                type: 'Verdi',
                id: uuidv4(),
                visningsnavn: 'Helse og omsorg',
                valgt: false
              },
              {
                type: 'Verdi',
                id: uuidv4(),
                visningsnavn: 'Transport og logistikk',
                valgt: false
              }
            ]
          },
          {
            type: 'Verdigruppe',
            id: uuidv4(),
            visningsnavn: 'Førerkortklasse',
            seleksjonstype: 'ENKELTVALG',
            alternativer: [
              {
                type: 'Verdi',
                id: uuidv4(),
                visningsnavn: 'B',
                valgt: true
              },
              {
                type: 'Verdi',
                id: uuidv4(),
                visningsnavn: 'C1',
                valgt: false
              },
              {
                type: 'Verdi',
                id: uuidv4(),
                visningsnavn: 'CE',
                valgt: false
              }
            ]
          }
        ]
      },
      {
        type: 'Verdigruppe',
        id: uuidv4(),
        visningsnavn: 'Sertifiseringer',
        seleksjonstype: 'FLERVALG',
        alternativer: [
          {
            type: 'Verdi',
            id: uuidv4(),
            visningsnavn: 'Truckførerbevis',
            valgt: false
          },
          {
            type: 'Verdi',
            id: uuidv4(),
            visningsnavn: 'Varmt arbeid',
            valgt: true
          }
        ]
      }
    ]
  }
}
