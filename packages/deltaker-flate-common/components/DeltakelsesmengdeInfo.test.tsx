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
  it('returnerer null når enkeltplass mangler nåværende og neste deltakelsesmengde', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      deltakelsesprosent: null,
      dagerPerUke: null,
      erEnkeltplass: true,
      nesteDeltakelsesmengde: null
    })

    expect(result).toBeNull()
  })

  it('viser "(ikke satt)" for nåværende periode når neste deltakelsesmengde finnes', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      deltakelsesprosent: null,
      dagerPerUke: null,
      erEnkeltplass: true,
      nesteDeltakelsesmengde: {
        deltakelsesprosent: 60,
        dagerPerUke: 3,
        gyldigFra: new Date('2025-08-01')
      }
    })
    const text = extractText(result).join(' ')

    expect(text).toContain('Nåværende periode:')
    expect(text).toContain('(ikke satt)')
    expect(text).toContain('3 dager i uka')
  })

  // Litt søkt edgecase, men test dokumenterer oppførsel som evt kan justeres ved behov.
  it('returnerer null når tiltaket ikke støtter deltakelsesmengde selv om neste periode finnes', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.OPPFOLGING,
      deltakelsesprosent: 80,
      dagerPerUke: 3,
      erEnkeltplass: false,
      nesteDeltakelsesmengde: {
        deltakelsesprosent: 60,
        dagerPerUke: 3,
        gyldigFra: new Date('2025-08-01')
      }
    })

    expect(result).toBeNull()
  })

  it('viser enkel periode når neste deltakelsesmengde mangler', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      deltakelsesprosent: null,
      dagerPerUke: 2,
      erEnkeltplass: true,
      nesteDeltakelsesmengde: null
    })
    const text = extractText(result).join(' ')

    expect(text).toContain('Deltakelsesmengde')
    expect(text).toContain('2 dager i uka')
    expect(text).not.toContain('Nåværende periode:')
  })

  it('returnerer null når dagerPerUke er 0 uten neste periode', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      deltakelsesprosent: null,
      dagerPerUke: 0,
      erEnkeltplass: true,
      nesteDeltakelsesmengde: null
    })

    expect(result).toBeNull()
  })

  it('returnerer null når tiltaket ikke har deltakelsesmengde', () => {
    const result = DeltakelsesmengdeInfo({
      tiltakskode: Tiltakskode.OPPFOLGING,
      deltakelsesprosent: 80,
      dagerPerUke: 3,
      erEnkeltplass: false,
      nesteDeltakelsesmengde: null
    })

    expect(result).toBeNull()
  })
})
