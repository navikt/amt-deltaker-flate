import { describe, expect, it } from 'vitest'
import { lagMockDeltaker } from '../mocks/mockData'
import {
  getFiltrerteDeltakere,
  getHandlingFilterDetaljer,
  getHandlingFiltrerteDeltakere,
  getStatusFilterDetaljer,
  getStatusFiltrerteDeltakere,
  HandlingFilterValg,
  StatusFilterValg
} from './filter-deltakerliste'
import { DeltakerStatusType } from 'deltaker-flate-common'

const mockDeltakere = [
  {
    ...lagMockDeltaker(),
    harAktiveForslag: false,
    harOppdateringFraNav: false,
    erNyDeltaker: false,
    status: {
      type: DeltakerStatusType.SOKT_INN,
      aarsak: null
    }
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: true,
    harOppdateringFraNav: false,
    erNyDeltaker: false,
    status: {
      type: DeltakerStatusType.VENTER_PA_OPPSTART,
      aarsak: null
    }
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: false,
    harOppdateringFraNav: true,
    erNyDeltaker: false,
    status: {
      type: DeltakerStatusType.DELTAR,
      aarsak: null
    }
  },
  {
    ...lagMockDeltaker(),
    harAktiveForslag: false,
    harOppdateringFraNav: false,
    erNyDeltaker: true,
    status: {
      type: DeltakerStatusType.DELTAR,
      aarsak: null
    }
  }
]

describe('getHandlingFiltrerteDeltakere', () => {
  it('returnerer alle deltakere hvis ingen filter er valgt', () => {
    const result = getHandlingFiltrerteDeltakere(mockDeltakere, [])
    expect(result).toHaveLength(mockDeltakere.length)
  })

  it('filtrerer på AktiveForslag', () => {
    const result = getHandlingFiltrerteDeltakere(mockDeltakere, [
      HandlingFilterValg.AktiveForslag
    ])
    expect(result).toHaveLength(1)
    expect(result.every((d) => d.harAktiveForslag)).toBe(true)
  })

  it('filtrerer på OppdateringFraNav', () => {
    const result = getHandlingFiltrerteDeltakere(mockDeltakere, [
      HandlingFilterValg.OppdateringFraNav
    ])
    expect(result).toHaveLength(1)
    expect(result[0].harOppdateringFraNav).toBe(true)
  })

  it('filtrerer på NyeDeltakere', () => {
    const result = getHandlingFiltrerteDeltakere(mockDeltakere, [
      HandlingFilterValg.NyeDeltakere
    ])
    expect(result).toHaveLength(1)
    expect(result[0].erNyDeltaker).toBe(true)
  })

  it('filtrerer med OR-logikk: minst ett filter matcher', () => {
    const result = getHandlingFiltrerteDeltakere(mockDeltakere, [
      HandlingFilterValg.OppdateringFraNav,
      HandlingFilterValg.NyeDeltakere
    ])
    expect(result).toHaveLength(2)
    expect(result.some((d) => d.harOppdateringFraNav)).toBe(true)
    expect(result.some((d) => d.erNyDeltaker)).toBe(true)
  })

  it('filtrerer med OR-logikk: alle filtre valgt', () => {
    const result = getHandlingFiltrerteDeltakere(mockDeltakere, [
      HandlingFilterValg.AktiveForslag,
      HandlingFilterValg.OppdateringFraNav,
      HandlingFilterValg.NyeDeltakere
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
    const result = getHandlingFiltrerteDeltakere(deltakere, [
      HandlingFilterValg.AktiveForslag,
      HandlingFilterValg.OppdateringFraNav,
      HandlingFilterValg.NyeDeltakere
    ])
    expect(result).toHaveLength(0)
  })

  it('returnerer tom liste hvis ingen deltakere matcher filter', () => {
    const result = getHandlingFiltrerteDeltakere(
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
      [HandlingFilterValg.AktiveForslag]
    )
    expect(result).toHaveLength(0)
  })
})

describe('getHandlingFilterDetaljer', () => {
  it('returnerer korrekt antall filter', () => {
    const detaljer = getHandlingFilterDetaljer(mockDeltakere, [], [])
    expect(detaljer).toHaveLength(Object.values(HandlingFilterValg).length)
  })

  it('viser valgt=true for valgte filter', () => {
    const detaljer = getHandlingFilterDetaljer(
      mockDeltakere,
      [HandlingFilterValg.AktiveForslag, HandlingFilterValg.NyeDeltakere],
      []
    )
    const aktive = detaljer.find(
      (d) => d.filtervalg === HandlingFilterValg.AktiveForslag
    )
    const nye = detaljer.find(
      (d) => d.filtervalg === HandlingFilterValg.NyeDeltakere
    )
    expect(aktive?.valgt).toBe(true)
    expect(nye?.valgt).toBe(true)
    const oppdatering = detaljer.find(
      (d) => d.filtervalg === HandlingFilterValg.OppdateringFraNav
    )
    expect(oppdatering?.valgt).toBe(false)
  })

  it('viser korrekt antall for hvert filter', () => {
    const detaljer = getHandlingFilterDetaljer(mockDeltakere, [], [])
    const aktive = detaljer.find(
      (d) => d.filtervalg === HandlingFilterValg.AktiveForslag
    )
    const oppdatering = detaljer.find(
      (d) => d.filtervalg === HandlingFilterValg.OppdateringFraNav
    )
    const nye = detaljer.find(
      (d) => d.filtervalg === HandlingFilterValg.NyeDeltakere
    )
    expect(aktive?.antall).toBe(
      getFiltrerteDeltakere(
        mockDeltakere,
        [HandlingFilterValg.AktiveForslag],
        []
      ).length
    )
    expect(oppdatering?.antall).toBe(
      getFiltrerteDeltakere(
        mockDeltakere,
        [HandlingFilterValg.OppdateringFraNav],
        []
      ).length
    )
    expect(nye?.antall).toBe(
      getFiltrerteDeltakere(
        mockDeltakere,
        [HandlingFilterValg.NyeDeltakere],
        []
      ).length
    )
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
    const detaljer = getHandlingFilterDetaljer(deltakere, [], [])
    detaljer.forEach((d) => expect(d.antall).toBe(0))
  })

  it('returnerer riktig antall når statusfilter og handlingsfilter er valgt', () => {
    const detaljer = getHandlingFilterDetaljer(
      [
        {
          ...lagMockDeltaker(),
          harOppdateringFraNav: true,
          status: {
            type: DeltakerStatusType.DELTAR,
            aarsak: null
          }
        },
        {
          ...lagMockDeltaker(),
          harOppdateringFraNav: true,
          status: {
            type: DeltakerStatusType.SOKT_INN,
            aarsak: null
          }
        }
      ],
      [HandlingFilterValg.OppdateringFraNav],
      ['DELTAR' as StatusFilterValg]
    )
    detaljer.forEach((d) => {
      if (d.filtervalg === HandlingFilterValg.OppdateringFraNav) {
        expect(d.antall).toBe(1)
      }
    })
  })
})

describe('getStatusFiltrerteDeltakere', () => {
  it('returnerer alle deltakere hvis ingen filter er valgt', () => {
    const result = getStatusFiltrerteDeltakere(mockDeltakere, [])
    expect(result).toHaveLength(mockDeltakere.length)
  })

  it('filtrerer på én status', () => {
    const result = getStatusFiltrerteDeltakere(mockDeltakere, [
      'DELTAR' as StatusFilterValg
    ])
    expect(result).toHaveLength(2)
    expect(result[0].status.type).toBe('DELTAR')
  })

  it('filtrerer på flere statuser (OR-logikk)', () => {
    const result = getStatusFiltrerteDeltakere(mockDeltakere, [
      'DELTAR' as StatusFilterValg,
      'SOKT_INN' as StatusFilterValg
    ])
    expect(result).toHaveLength(3)
  })

  it('returnerer tom liste hvis ingen matcher status', () => {
    const result = getStatusFiltrerteDeltakere(mockDeltakere, [
      'IKKE_AKTUELL' as StatusFilterValg
    ])
    expect(result).toHaveLength(0)
  })
})

describe('getStatusFilterDetaljer', () => {
  it('viser valgt=true for valgte statusfilter', () => {
    const detaljer = getStatusFilterDetaljer(
      mockDeltakere,
      ['DELTAR' as StatusFilterValg, 'FULLFORT' as StatusFilterValg],
      []
    )
    const deltar = detaljer.find((d) => d.filtervalg === 'DELTAR')
    const fullfort = detaljer.find((d) => d.filtervalg === 'FULLFORT')
    expect(deltar?.valgt).toBe(true)
    expect(fullfort?.valgt).toBe(true)
    const soktInn = detaljer.find((d) => d.filtervalg === 'SOKT_INN')
    expect(soktInn?.valgt).toBe(false)
  })

  it('viser korrekt antall for hvert statusfilter', () => {
    const detaljer = getStatusFilterDetaljer(mockDeltakere, [], [])
    const deltar = detaljer.find((d) => d.filtervalg === 'DELTAR')
    const fullfort = detaljer.find((d) => d.filtervalg === 'FULLFORT')
    expect(deltar?.antall).toBe(2)
    expect(fullfort?.antall).toBe(0)
  })

  it('returnerer 0 for statusfilter uten treff', () => {
    const deltakere = [
      {
        ...lagMockDeltaker(),
        status: {
          type: DeltakerStatusType.UTKAST_TIL_PAMELDING,
          aarsak: null
        }
      }
    ]
    const detaljer = getStatusFilterDetaljer(deltakere, [], [])
    detaljer.forEach((d) => {
      expect(d.antall).toBe(0)
    })
  })

  it('returnerer riktig antall når statusfilter og handlingsfilter er valgt', () => {
    const detaljer = getStatusFilterDetaljer(
      [
        {
          ...lagMockDeltaker(),
          harOppdateringFraNav: true,
          status: {
            type: DeltakerStatusType.DELTAR,
            aarsak: null
          }
        },
        {
          ...lagMockDeltaker(),
          harOppdateringFraNav: false,
          status: {
            type: DeltakerStatusType.DELTAR,
            aarsak: null
          }
        }
      ],
      ['DELTAR' as StatusFilterValg],
      [HandlingFilterValg.OppdateringFraNav]
    )
    detaljer.forEach((d) => {
      if (d.filtervalg === 'DELTAR') {
        expect(d.antall).toBe(1)
      }
    })
  })
})
