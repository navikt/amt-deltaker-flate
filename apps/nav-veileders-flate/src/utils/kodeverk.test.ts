import { describe, expect, it } from 'vitest'
import {
  type OpplaringKategorisering,
  OpplaringRepresenterer
} from 'deltaker-flate-common'
import { getValgteVerdier } from './kodeverk'

describe('getValgteVerdier', () => {
  it('henter valgte id-er fra en kategorisering', () => {
    const kodeverkValg: OpplaringKategorisering = {
      valgteKategoriseringer: [
        {
          representerer: OpplaringRepresenterer.BRANSJE_ID,
          valg: [
            { id: 'bransje-1', visningsnavn: 'Bygg' },
            { id: 'bransje-2', visningsnavn: 'Helse' }
          ]
        }
      ],
      valgteSertifiseringer: []
    }

    expect(getValgteVerdier(kodeverkValg)).toEqual([
      {
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        valgteIder: ['bransje-1', 'bransje-2']
      }
    ])
  })

  it('henter valgte id-er fra flere kategoriseringer', () => {
    const kodeverkValg: OpplaringKategorisering = {
      valgteKategoriseringer: [
        {
          representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
          valg: [{ id: 'utdanning-1', visningsnavn: 'Bygg- og anleggsteknikk' }]
        },
        {
          representerer: OpplaringRepresenterer.LAREFAG,
          valg: [
            { id: 'larefag-1', visningsnavn: 'Tømrerfaget' },
            { id: 'larefag-2', visningsnavn: 'Rørleggerfaget' }
          ]
        }
      ],
      valgteSertifiseringer: []
    }

    expect(getValgteVerdier(kodeverkValg)).toEqual([
      {
        representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
        valgteIder: ['utdanning-1']
      },
      {
        representerer: OpplaringRepresenterer.LAREFAG,
        valgteIder: ['larefag-1', 'larefag-2']
      }
    ])
  })

  it('returnerer tom liste når kategoriseringer ikke har valg', () => {
    const kodeverkValg: OpplaringKategorisering = {
      valgteKategoriseringer: [
        {
          representerer: OpplaringRepresenterer.FORERKORT,
          valg: []
        },
        {
          representerer: OpplaringRepresenterer.LAREFAG,
          valg: []
        }
      ],
      valgteSertifiseringer: []
    }

    expect(getValgteVerdier(kodeverkValg)).toEqual([])
  })

  it('returnerer tom liste når kodeverk er null', () => {
    expect(getValgteVerdier(null)).toEqual([])
  })
})
