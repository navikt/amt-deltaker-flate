import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../model/deltaker'
import { DeltakelsesmengdeAvsnitt } from './DeltakelsesmengdeAvsnitt'
import { extractText } from './test-utils'

describe('DeltakelsesmengdeAvsnitt', () => {
  it('returnerer null når tiltaket ikke har deltakelsesmengde', () => {
    const result = DeltakelsesmengdeAvsnitt({
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3,
      headingLevel: '3',
      headingSize: 'small'
    })

    expect(result).toBeNull()
  })

  it('renderer tekst når tiltaket har deltakelsesmengde', () => {
    const result = DeltakelsesmengdeAvsnitt({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3,
      headingLevel: '3',
      headingSize: 'small'
    })

    expect(extractText(result).join(' ')).toContain('80')
    expect(extractText(result).join(' ')).toContain('Deltakelsesmengde')
  })

  it('skjuler rendering når teksten er tom', () => {
    const result = DeltakelsesmengdeAvsnitt({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: true,
      deltakelsesprosent: null,
      dagerPerUke: 0,
      headingLevel: '3',
      headingSize: 'small'
    })

    expect(result).toBeNull()
  })
})
