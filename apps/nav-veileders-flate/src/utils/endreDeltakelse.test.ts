import { DeltakerStatusType } from 'deltaker-flate-common'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PameldingResponse } from '../api/data/pamelding'
import { erDeltakelseLaast, getNyesteDato } from './endreDeltakelse'
import dayjs from 'dayjs'

// Mock the status utils functions
vi.mock('./statusutils', () => ({
  deltakerHarAvsluttendeStatus: vi.fn((status: DeltakerStatusType) =>
    [
      DeltakerStatusType.AVBRUTT,
      DeltakerStatusType.FULLFORT,
      DeltakerStatusType.IKKE_AKTUELL
    ].includes(status)
  )
}))

// Mock the utils functions
vi.mock('./utils', () => ({
  dateStrToNullableDate: vi.fn((dateStr: string | null) =>
    dateStr ? new Date(dateStr) : null
  )
}))

describe('getNyesteDato', () => {
  it('returnerer null når array er tomt', () => {
    const result = getNyesteDato([])
    expect(result).toBeNull()
  })

  it('returnerer null når alle datoer er null', () => {
    const result = getNyesteDato([null, null, null])
    expect(result).toBeNull()
  })

  it('returnerer enkelt dato når kun en gyldig dato finnes', () => {
    const date = new Date('2023-06-15')
    const result = getNyesteDato([null, date, null])
    expect(result).toEqual(date)
  })

  it('returnerer nyeste dato når flere gyldige datoer finnes', () => {
    const date1 = new Date('2025-01-15')
    const date2 = new Date('2025-06-15')
    const date3 = new Date('2025-03-15')
    const result = getNyesteDato([date1, date2, date3])
    expect(result).toEqual(date2)
  })

  it('returnerer nyeste dato når det er blanding av null og gyldige datoer', () => {
    const date1 = new Date('2023-01-15')
    const date2 = new Date('2023-06-15')
    const date3 = new Date('2023-03-15')
    const result = getNyesteDato([null, date1, null, date2, date3, null])
    expect(result).toEqual(date2)
  })

  it('håndterer datoer med samme tidsstempel', () => {
    const date1 = new Date('2023-06-15T10:00:00Z')
    const date2 = new Date('2023-06-15T10:00:00Z')
    const result = getNyesteDato([date1, date2])
    expect(result).toEqual(date1) // Eller date2, de er like
  })

  it('håndterer datoer med millisekund-forskjeller', () => {
    const date1 = new Date('2023-06-15T10:00:00.100Z')
    const date2 = new Date('2023-06-15T10:00:00.200Z')
    const date3 = new Date('2023-06-15T10:00:00.050Z')
    const result = getNyesteDato([date1, date2, date3])
    expect(result).toEqual(date2)
  })

  it('returnerer nyeste dato når datoer spenner over flere år', () => {
    const date1 = new Date('2020-12-31')
    const date2 = new Date('2023-01-01')
    const date3 = new Date('2022-06-15')
    const result = getNyesteDato([date1, date2, date3])
    expect(result).toEqual(date2)
  })

  it('håndterer fremtidige datoer', () => {
    const date1 = new Date('2025-01-01')
    const date2 = new Date('2024-12-31')
    const result = getNyesteDato([date1, date2])
    expect(result).toEqual(date1)
  })
})

describe('erDeltakelseLaast', () => {
  let mockPamelding: PameldingResponse

  beforeEach(() => {
    mockPamelding = {
      kanEndres: true,
      status: {
        type: DeltakerStatusType.HAR_SLUTTET,
        gyldigFra: new Date('2025-08-12')
      },
      sluttdato: '2025-07-25'
    } as PameldingResponse
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returnerer true når deltaker ikke kan endres', () => {
    mockPamelding.kanEndres = false
    const result = erDeltakelseLaast(mockPamelding)
    expect(result).toBe(true)
  })

  it('returnerer false når deltaker ikke har avsluttende status', () => {
    mockPamelding.status.type = DeltakerStatusType.DELTAR
    const result = erDeltakelseLaast(mockPamelding)
    expect(result).toBe(false)
  })

  it('returnerer true når nyeste dato er mer enn 2 måneder siden', () => {
    mockPamelding.status.type = DeltakerStatusType.AVBRUTT
    mockPamelding.sluttdato = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
    mockPamelding.status.gyldigFra = dayjs().subtract(3, 'month').toDate()
    const result = erDeltakelseLaast(mockPamelding)
    expect(result).toBe(true)
  })

  it('returnerer false når nyeste dato er mindre enn 2 måneder siden', () => {
    mockPamelding.status.type = DeltakerStatusType.AVBRUTT
    // Set date to less than 2 months ago (after July 1st, 2025)
    mockPamelding.sluttdato = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
    mockPamelding.status.gyldigFra = dayjs().subtract(1, 'month').toDate()
    const result = erDeltakelseLaast(mockPamelding)
    expect(result).toBe(false)
  })

  it('bruker nyeste dato av sluttdato og statusGyldigFra', () => {
    mockPamelding.status.type = DeltakerStatusType.FULLFORT
    mockPamelding.sluttdato = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
    mockPamelding.status.gyldigFra = dayjs().subtract(1, 'month').toDate()
    const result = erDeltakelseLaast(mockPamelding)
    expect(result).toBe(false)
  })

  it('håndterer null sluttdato', () => {
    mockPamelding.status.type = DeltakerStatusType.AVBRUTT
    mockPamelding.sluttdato = null
    mockPamelding.status.gyldigFra = dayjs().subtract(1, 'month').toDate()
    const result = erDeltakelseLaast(mockPamelding)
    expect(result).toBe(false)
  })

  it('håndterer grenseverdi nøyaktig 2 måneder siden', () => {
    mockPamelding.status.type = DeltakerStatusType.FULLFORT
    mockPamelding.sluttdato = dayjs().subtract(2, 'month').format('YYYY-MM-DD') // Exactly 2 months ago
    mockPamelding.status.gyldigFra = dayjs().subtract(3, 'month').toDate() // More than 2 months ago
    const result = erDeltakelseLaast(mockPamelding)
    expect(result).toBe(true)
  })
})
