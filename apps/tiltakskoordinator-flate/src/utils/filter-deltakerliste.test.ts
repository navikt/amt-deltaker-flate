import { describe, expect, it } from 'vitest'
import { lagMockDeltaker } from '../mocks/mockData'
import {
  FilterValg,
  getFilterDetaljer,
  getFiltrerteDeltakere
} from './filter-deltakerliste'

const mockDeltakere = [
  {
    ...lagMockDeltaker(),
    harAktiveForslag: false,
    harOppdateringFraNav: false,
    erNyDeltaker: false
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: true,
    harOppdateringFraNav: false,
    erNyDeltaker: false
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: false,
    harOppdateringFraNav: true,
    erNyDeltaker: false
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: false,
    harOppdateringFraNav: false,
    erNyDeltaker: true
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
    expect(result).toHaveLength(1)
    expect(result.every((d) => d.harAktiveForslag)).toBe(true)
  })

  it('filtrerer på OppdateringFraNav', () => {
    const result = getFiltrerteDeltakere(mockDeltakere, [
      FilterValg.OppdateringFraNav
    ])
    expect(result).toHaveLength(1)
    expect(result[0].harOppdateringFraNav).toBe(true)
  })

  it('filtrerer på NyeDeltakere', () => {
    const result = getFiltrerteDeltakere(mockDeltakere, [
      FilterValg.NyeDeltakere
    ])
    expect(result).toHaveLength(1)
    expect(result[0].erNyDeltaker).toBe(true)
  })

  it('filtrerer med OR-logikk: minst ett filter matcher', () => {
    const result = getFiltrerteDeltakere(mockDeltakere, [
      FilterValg.OppdateringFraNav,
      FilterValg.NyeDeltakere
    ])
    expect(result).toHaveLength(2)
    expect(result.some((d) => d.harOppdateringFraNav)).toBe(true)
    expect(result.some((d) => d.erNyDeltaker)).toBe(true)
  })

  it('filtrerer med OR-logikk: alle filtre valgt', () => {
    const result = getFiltrerteDeltakere(mockDeltakere, [
      FilterValg.AktiveForslag,
      FilterValg.OppdateringFraNav,
      FilterValg.NyeDeltakere
    ])
    expect(result).toHaveLength(3)
    expect(
      result.every(
        (d) => d.harAktiveForslag || d.harOppdateringFraNav || d.erNyDeltaker
      )
    ).toBe(true)
  })

  it('returnerer tom liste hvis ingen matcher noen filter', () => {
    const deltakere = [
      {
        ...lagMockDeltaker(),
        harAktiveForslag: false,
        harOppdateringFraNav: false,
        erNyDeltaker: false
      }
    ]
    const result = getFiltrerteDeltakere(deltakere, [
      FilterValg.AktiveForslag,
      FilterValg.OppdateringFraNav,
      FilterValg.NyeDeltakere
    ])
    expect(result).toHaveLength(0)
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

describe('getFilterDetaljer', () => {
  it('returnerer korrekt antall', () => {
    const detaljer = getFilterDetaljer(mockDeltakere, [])
    expect(detaljer).toHaveLength(Object.values(FilterValg).length)
  })

  it('viser valgt=true for valgte filter', () => {
    const detaljer = getFilterDetaljer(mockDeltakere, [
      FilterValg.AktiveForslag,
      FilterValg.NyeDeltakere
    ])
    const aktive = detaljer.find(
      (d) => d.filtervalg === FilterValg.AktiveForslag
    )
    const nye = detaljer.find((d) => d.filtervalg === FilterValg.NyeDeltakere)
    expect(aktive?.valgt).toBe(true)
    expect(nye?.valgt).toBe(true)
    const oppdatering = detaljer.find(
      (d) => d.filtervalg === FilterValg.OppdateringFraNav
    )
    expect(oppdatering?.valgt).toBe(false)
  })

  it('viser korrekt antall for hvert filter', () => {
    const detaljer = getFilterDetaljer(mockDeltakere, [])
    const aktive = detaljer.find(
      (d) => d.filtervalg === FilterValg.AktiveForslag
    )
    const oppdatering = detaljer.find(
      (d) => d.filtervalg === FilterValg.OppdateringFraNav
    )
    const nye = detaljer.find((d) => d.filtervalg === FilterValg.NyeDeltakere)
    expect(aktive?.antall).toBe(1)
    expect(oppdatering?.antall).toBe(1)
    expect(nye?.antall).toBe(1)
  })

  it('returnerer 0 for filter uten treff', () => {
    const deltakere = [
      {
        ...lagMockDeltaker(),
        harAktiveForslag: false,
        harOppdateringFraNav: false,
        erNyDeltaker: false
      }
    ]
    const detaljer = getFilterDetaljer(deltakere, [])
    detaljer.forEach((d) => expect(d.antall).toBe(0))
  })
})
