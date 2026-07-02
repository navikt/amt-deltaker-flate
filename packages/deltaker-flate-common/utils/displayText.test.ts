import { describe, expect, it } from 'vitest'
import { deltakerprosentText } from './displayText'

describe('deltakerprosentText', () => {
  it.each([
    {
      navn: 'enkeltplass uten dager',
      deltakelsesprosent: null,
      dagerPerUke: null,
      erEnkeltplass: true,
      expected: ''
    },
    {
      navn: 'enkeltplass med 1 dag',
      deltakelsesprosent: null,
      dagerPerUke: 1,
      erEnkeltplass: true,
      expected: '1 dag i uka'
    },
    {
      navn: 'enkeltplass med flere dager',
      deltakelsesprosent: null,
      dagerPerUke: 3,
      erEnkeltplass: true,
      expected: '3 dager i uka'
    },
    {
      navn: 'gruppe uten dager',
      deltakelsesprosent: 80,
      dagerPerUke: null,
      erEnkeltplass: false,
      expected: '80\u00A0%'
    },
    {
      navn: 'gruppe med prosent og dager',
      deltakelsesprosent: 50,
      dagerPerUke: 3,
      erEnkeltplass: false,
      expected: '50\u00A0% fordelt på 3 dager i uka'
    },
    {
      navn: 'gruppe med nullverdi for prosent bruker 100 som fallback',
      deltakelsesprosent: null,
      dagerPerUke: 2,
      erEnkeltplass: false,
      expected: '100\u00A0% fordelt på 2 dager i uka'
    }
  ])(
    '$navn',
    ({ deltakelsesprosent, dagerPerUke, erEnkeltplass, expected }) => {
      expect(
        deltakerprosentText(deltakelsesprosent, dagerPerUke, erEnkeltplass)
      ).toBe(expected)
    }
  )

  it('har aldri trailing mellomrom for vanlige gruppe-verdier', () => {
    expect(deltakerprosentText(80, null, false)).not.toMatch(/\s$/)
    expect(deltakerprosentText(80, 3, false)).not.toMatch(/\s$/)
  })

  it('0 dager behandles som manglende dager', () => {
    expect(deltakerprosentText(80, 0, false)).toBe('80\u00A0%')
    expect(deltakerprosentText(null, 0, true)).toBe('')
  })
})
