import { isValidElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../model/deltaker'
import {
  DeltakelsesmengdeBodyLongSection,
  DeltakelsesmengdeInline,
  DeltakelsesmengdeAvsnitt,
  getDeltakelsesmengdeText
} from './DeltakelsesmengdeVisning'

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

describe('DeltakelsesmengdeSection', () => {
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

  it('skjuler rendering når tekst er tom selv uten hideWhenEmpty', () => {
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
