import { describe, expect, it } from 'vitest'
import { deltakerprosentText } from './displayText'

describe('deltakerprosentText', () => {
  it('illustrerer problemet: enkeltplass uten dager gir tom tekst', () => {
    expect(deltakerprosentText(null, null, true)).toBe('')
  })

  it('illustrerer problemet: gruppe uten dager får trailing space', () => {
    expect(deltakerprosentText(80, null, false)).toBe('80\u00A0% ')
  })

  it('happypath: enkeltplass med 1 dag', () => {
    expect(deltakerprosentText(null, 1, true)).toBe('1 dag i uka')
  })

  it('happypath: enkeltplass med flere dager', () => {
    expect(deltakerprosentText(null, 3, true)).toBe('3 dager i uka')
  })

  it('happypath: gruppe med prosent og dager', () => {
    expect(deltakerprosentText(50, 3, false)).toBe(
      '50\u00A0% fordelt på 3 dager i uka'
    )
  })
})
