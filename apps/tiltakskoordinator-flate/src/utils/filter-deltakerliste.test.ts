import { describe, it, expect } from 'vitest'
import { getFiltrerteDeltakere, FilterValg } from './filter-deltakerliste'
import { lagMockDeltaker } from '../mocks/mockData'

const mockDeltakere = [
  {
    ...lagMockDeltaker(),
    harAktiveForslag: false
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: true
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: true
  }
]

describe('getFiltrerteDeltakere', () => {
  it('returnerer alle deltakere hvis ingen filter er valgt', () => {
    const result = getFiltrerteDeltakere(mockDeltakere, [])
    expect(result).toHaveLength(mockDeltakere.length)
  })

  it('filtrerer på AktiveForslag', () => {
    const result = getFiltrerteDeltakere(mockDeltakere, [
      FilterValg.AktiveForslag
    ])
    expect(result).toHaveLength(2)
    expect(result.every((d) => d.harAktiveForslag)).toBe(true)
  })

  it('returnerer tom liste hvis ingen deltakere matcher filter', () => {
    const result = getFiltrerteDeltakere(
      [
        {
          ...lagMockDeltaker(),
          harAktiveForslag: false
        },
        {
          ...lagMockDeltaker(),
          harAktiveForslag: false
        }
      ],
      [FilterValg.AktiveForslag]
    )
    expect(result).toHaveLength(0)
  })
})
