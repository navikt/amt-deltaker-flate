import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../model/deltaker'
import {
  DeltakelsesmengdeBodyLongSection,
  DeltakelsesmengdeInline,
  getDeltakelsesmengdeText
} from './DeltakelsesmengdeVisning'
import { extractText } from './test-utils'

describe('DeltakelsesmengdeBodyLongSection', () => {
  it('renderer heading og tekst', () => {
    const result = DeltakelsesmengdeBodyLongSection({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3
    })
    const text = extractText(result).join(' ')
    expect(text).toContain('Deltakelsesmengde')
    expect(text).toContain('80')
  })
})

describe('DeltakelsesmengdeInline', () => {
  it('renderer inline prefix og tekst', () => {
    const result = DeltakelsesmengdeInline({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3
    })
    const text = extractText(result).join(' ')
    expect(text).toContain('Deltakelsesmengde:')
    expect(text).toContain('80')
  })
})

describe('getDeltakelsesmengdeText', () => {
  it('returnerer null når tiltaket ikke har deltakelsesmengde', () => {
    const result = getDeltakelsesmengdeText({
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3
    })

    expect(result).toBeNull()
  })
})
