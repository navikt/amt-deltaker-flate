import { isValidElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../model/deltaker'
import { DeltakelsesmengdeInfo } from './DeltakelsesmengdeInfo'

const extractText = (node: ReactNode): string[] => {
  if (node == null || typeof node === 'boolean') {
    return []
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return [String(node)]
  }
  if (Array.isArray(node)) {
    return node.flatMap(extractText)
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return []
}

describe('DeltakelsesmengdeInfo', () => {
  it('returnerer null når det ikke finnes gyldige deltakelsesmengder', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: true,
      deltakelsesmengder: []
    })

    expect(result).toBeNull()
  })

  it('returnerer null når tiltaket ikke støtter deltakelsesmengde', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false,
      deltakelsesmengder: [
        {
          deltakelsesprosent: 80,
          dagerPerUke: 3,
          gyldigFra: new Date(2026, 9, 12)
        }
      ]
    })

    expect(result).toBeNull()
  })

  it('viser alle deltakelsesmengder som sorterte kulepunkter med startdato', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesmengder: [
        {
          deltakelsesprosent: 60,
          dagerPerUke: 3,
          gyldigFra: new Date(2026, 9, 20)
        },
        {
          deltakelsesprosent: 40,
          dagerPerUke: 2,
          gyldigFra: new Date(2026, 9, 12)
        }
      ]
    })
    const text = extractText(result).join(' ')

    expect(text.indexOf('12.10.2026:')).toBeLessThan(
      text.indexOf('20.10.2026:')
    )
    expect(text).toContain('40')
    expect(text).toContain('2 dager i uka')
    expect(text).toContain('60')
    expect(text).toContain('3 dager i uka')
    expect(text).not.toContain('Periode')
    expect(text).not.toContain('t.o.m.')
  })

  it('viser dager uten prosent for enkeltplass', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: true,
      deltakelsesmengder: [
        {
          deltakelsesprosent: 60,
          dagerPerUke: 3,
          gyldigFra: new Date(2026, 9, 12)
        }
      ]
    })
    const text = extractText(result).join(' ')

    expect(text).toContain('12.10.2026:')
    expect(text).toContain('3 dager i uka')
    expect(text).not.toContain('60')
  })
})
