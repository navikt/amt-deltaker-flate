import { Tiltakskode } from 'deltaker-flate-common'
import {
  KodeverkAlternativType,
  KodeverkResponse,
  Seleksjonstype
} from '../api/data/kodeverk'

export const createMockKodeverkResponse = (
  tiltakskode: Tiltakskode
): KodeverkResponse => {
  return (
    mockKodeverk.find((kodeverk) => kodeverk.tiltakskode === tiltakskode) ?? {
      tiltakskode,
      kategorier: []
    }
  )
}

const mockKodeverk: KodeverkResponse[] = [
  {
    tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
    kategorier: [
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
      },
      {
        type: KodeverkAlternativType.GRUPPE,
        id: 'e5f6a7b8-c9d0-4123-9ef0-123456789abc',
        visningsnavn: 'Utdanningsprogram og kompetanse',
        alternativer: [
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: 'f6a7b8c9-d0e1-4234-9f01-23456789abcd',
            visningsnavn: 'Utdanningsprogram',
            representerer: 'utdanningsprogram',
            seleksjonstype: Seleksjonstype.ENKELTVALG,
            alternativer: [
              {
                type: KodeverkAlternativType.VERDI,
                id: 'a7b8c9d0-e1f2-4345-9012-3456789abcde',
                visningsnavn: 'Bygg- og anleggsteknikk',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'b8c9d0e1-f2a3-4456-9123-456789abcdef',
                visningsnavn: 'Helse- og oppvekstfag',
                valgt: true
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'c9d0e1f2-a3b4-4567-9234-56789abcdef0',
                visningsnavn: 'Teknologi- og industrifag',
                valgt: false
              }
            ]
          },
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: 'd0e1f2a3-b4c5-4678-9345-6789abcdef01',
            visningsnavn: 'Kompetansenivå',
            representerer: 'kompetansenivaa',
            seleksjonstype: Seleksjonstype.ENKELTVALG,
            alternativer: [
              {
                type: KodeverkAlternativType.VERDI,
                id: 'e1f2a3b4-c5d6-4789-9456-789abcdef012',
                visningsnavn: 'Grunnleggende',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'f2a3b4c5-d6e7-4890-9567-89abcdef0123',
                visningsnavn: 'Videregående',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'a3b4c5d6-e7f8-4901-9678-9abcdef01234',
                visningsnavn: 'Fagbrev',
                valgt: false
              }
            ]
          },
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: 'b4c5d6e7-f8a9-4012-9789-abcdef012345',
            visningsnavn: 'Varighet',
            representerer: 'varighet',
            seleksjonstype: Seleksjonstype.ENKELTVALG,
            alternativer: [
              {
                type: KodeverkAlternativType.VERDI,
                id: 'c5d6e7f8-a9b0-4123-9890-bcdef0123456',
                visningsnavn: 'Kort (under 3 måneder)',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'd6e7f8a9-b0c1-4234-9901-cdef01234567',
                visningsnavn: 'Middels (3–6 måneder)',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'e7f8a9b0-c1d2-4345-9012-def012345678',
                visningsnavn: 'Lang (over 6 måneder)',
                valgt: false
              }
            ]
          }
        ]
      },
      {
        type: KodeverkAlternativType.GRUPPE,
        id: 'f8a9b0c1-d2e3-4456-9123-ef0123456789',
        visningsnavn: 'Språk og kommunikasjon',
        alternativer: [
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: 'a9b0c1d2-e3f4-4567-9234-f01234567890',
            visningsnavn: 'Undervisningsspråk',
            representerer: 'undervisningssprak',
            seleksjonstype: Seleksjonstype.FLERVALG,
            alternativer: [
              {
                type: KodeverkAlternativType.VERDI,
                id: 'b0c1d2e3-f4a5-4678-9345-012345678901',
                visningsnavn: 'Norsk',
                valgt: true
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'c1d2e3f4-a5b6-4789-9456-123456789012',
                visningsnavn: 'Engelsk',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'd2e3f4a5-b6c7-4890-9567-234567890123',
                visningsnavn: 'Arabisk',
                valgt: false
              }
            ]
          },
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: 'e3f4a5b6-c7d8-4901-9678-345678901234',
            visningsnavn: 'Norsknivå',
            representerer: 'norsknivaa',
            seleksjonstype: Seleksjonstype.ENKELTVALG,
            alternativer: [
              {
                type: KodeverkAlternativType.VERDI,
                id: 'f4a5b6c7-d8e9-4012-9789-456789012345',
                visningsnavn: 'A1 – Nybegynner',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'a5b6c7d8-e9f0-4123-9890-567890123456',
                visningsnavn: 'A2 – Grunnleggende',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'b6c7d8e9-f0a1-4234-9901-678901234567',
                visningsnavn: 'B1 – Selvstendig',
                valgt: false
              }
            ]
          },
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: 'c7d8e9f0-a1b2-4345-9012-789012345678',
            visningsnavn: 'Læringsform',
            representerer: 'laeringsform',
            seleksjonstype: Seleksjonstype.FLERVALG,
            alternativer: [
              {
                type: KodeverkAlternativType.VERDI,
                id: 'd8e9f0a1-b2c3-4456-9123-890123456789',
                visningsnavn: 'Klasseromsundervisning',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'e9f0a1b2-c3d4-4567-9234-901234567890',
                visningsnavn: 'Nettbasert',
                valgt: false
              },
              {
                type: KodeverkAlternativType.VERDI,
                id: 'f0a1b2c3-d4e5-4678-9345-012345678901',
                visningsnavn: 'Praksis',
                valgt: true
              }
            ]
          }
        ]
      }
    ]
  }
]
