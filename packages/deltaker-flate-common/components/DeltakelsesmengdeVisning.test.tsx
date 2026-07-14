import { isValidElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../model/deltaker'
import {
  DeltakelsesmengdeVisning,
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

describe('DeltakelsesmengdeVisning', () => {
  it('returnerer null når tiltaket ikke har deltakelsesmengde', () => {
    const result = DeltakelsesmengdeVisning({
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3,
      children: (text) => text
    })

    expect(result).toBeNull()
  })

  it('renderer tekst når tiltaket har deltakelsesmengde', () => {
    const result = DeltakelsesmengdeVisning({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false,
      deltakelsesprosent: 80,
      dagerPerUke: 3,
      children: (text) => text
    })

    expect(extractText(result).join(' ')).toContain('80')
  })

  it('hideWhenEmpty skjuler rendering når tekst er tom', () => {
    const result = DeltakelsesmengdeVisning({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: true,
      deltakelsesprosent: null,
      dagerPerUke: 0,
      hideWhenEmpty: true,
      children: (text) => text
    })

    expect(result).toBeNull()
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
