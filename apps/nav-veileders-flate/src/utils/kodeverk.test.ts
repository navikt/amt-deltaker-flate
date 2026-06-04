import { describe, expect, it } from 'vitest'
import { OpplaringRepresenterer } from 'deltaker-flate-common'
import {
  KodeverkAlternativType,
  Seleksjonstype,
  type KodeverkContainer
} from '../api/data/kodeverk'
import { getValgteVerdier } from './kodeverk'

describe('getValgteVerdier', () => {
  it('henter valgte id-er fra en verdigruppe', () => {
    const alternativer: KodeverkContainer[] = [
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        visningsnavn: 'Bransje',
        pakrevd: true,
        seleksjonstype: Seleksjonstype.ENKELTVALG,
        alternativer: [
          { id: 'bransje-1', visningsnavn: 'Bygg', valgt: true },
          { id: 'bransje-2', visningsnavn: 'Helse', valgt: false }
        ]
      }
    ]

    expect(getValgteVerdier(alternativer)).toEqual([
      {
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        valgteIder: ['bransje-1']
      }
    ])
  })

  it('deler utdanningsgruppe opp i utdanningsprogram og lærefag', () => {
    const alternativer: KodeverkContainer[] = [
      {
        type: KodeverkAlternativType.UTDANNING_GRUPPE,
        visningsnavn: 'Utdanningsprogram',
        representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
        pakrevd: true,
        utdanninger: [
          {
            id: 'utdanning-1',
            visningsnavn: 'Bygg- og anleggsteknikk',
            larefag: {
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                { id: 'larefag-1', visningsnavn: 'Tømrerfaget', valgt: true },
                {
                  id: 'larefag-2',
                  visningsnavn: 'Rørleggerfaget',
                  valgt: false
                }
              ]
            }
          },
          {
            id: 'utdanning-2',
            visningsnavn: 'Elektro og datateknologi',
            larefag: {
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: 'larefag-3',
                  visningsnavn: 'Elektrikerfaget',
                  valgt: true
                }
              ]
            }
          },
          {
            id: 'utdanning-3',
            visningsnavn: 'Naturbruk',
            larefag: {
              visningsnavn: 'Lærefag',
              pakrevd: true,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                {
                  id: 'larefag-4',
                  visningsnavn: 'Akvakulturfaget',
                  valgt: false
                }
              ]
            }
          }
        ]
      }
    ]

    expect(getValgteVerdier(alternativer)).toEqual([
      {
        representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
        valgteIder: ['utdanning-1', 'utdanning-2']
      },
      {
        representerer: OpplaringRepresenterer.LAREFAG,
        valgteIder: ['larefag-1', 'larefag-3']
      }
    ])
  })

  it('returnerer tom liste når ingen verdier er valgt', () => {
    const alternativer: KodeverkContainer[] = [
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        representerer: OpplaringRepresenterer.FORERKORT,
        visningsnavn: 'Førerkort',
        pakrevd: false,
        seleksjonstype: Seleksjonstype.FLERVALG,
        alternativer: [{ id: 'foererkort-1', visningsnavn: 'B', valgt: false }]
      },
      {
        type: KodeverkAlternativType.UTDANNING_GRUPPE,
        visningsnavn: 'Utdanningsprogram',
        representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
        pakrevd: false,
        utdanninger: [
          {
            id: 'utdanning-1',
            visningsnavn: 'Bygg- og anleggsteknikk',
            larefag: {
              visningsnavn: 'Lærefag',
              pakrevd: false,
              representerer: OpplaringRepresenterer.LAREFAG,
              seleksjonstype: Seleksjonstype.FLERVALG,
              alternativer: [
                { id: 'larefag-1', visningsnavn: 'Tømrerfaget', valgt: false }
              ]
            }
          }
        ]
      }
    ]

    expect(getValgteVerdier(alternativer)).toEqual([])
  })
})
