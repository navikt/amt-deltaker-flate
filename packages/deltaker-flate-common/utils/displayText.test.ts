import { describe, expect, it } from 'vitest'
import { deltakerprosentText } from './displayText'

describe('deltakerprosentText', () => {
  it('enkeltplass uten dager gir tom tekst', () => {
    expect(deltakerprosentText(null, null, true)).toBe('')
  })

  it('gruppe uten dager har ikke trailing space', () => {
    expect(deltakerprosentText(80, null, false)).toBe('80\u00A0%')
  })

  it('enkeltplass med 1 dag', () => {
    expect(deltakerprosentText(null, 1, true)).toBe('1 dag i uka')
  })

  it('enkeltplass med flere dager', () => {
    expect(deltakerprosentText(null, 3, true)).toBe('3 dager i uka')
  })

  it('gruppe med prosent og dager', () => {
    expect(deltakerprosentText(50, 3, false)).toBe(
      '50\u00A0% fordelt på 3 dager i uka'
    )
  })
})
