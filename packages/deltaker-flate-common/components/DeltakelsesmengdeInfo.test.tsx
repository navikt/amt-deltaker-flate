import { isValidElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
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
      deltakelsesprosent: null,
      dagerPerUke: null,
      erEnkeltplass: true,
      nesteDeltakelsesmengde: null
    })

    expect(result).toBeNull()
  })

  it('viser "(ikke satt)" for nåværende periode når neste deltakelsesmengde finnes', () => {
    const result = DeltakelsesmengdeInfo({
      deltakelsesprosent: null,
      dagerPerUke: null,
      erEnkeltplass: true,
      nesteDeltakelsesmengde: {
        deltakelsesprosent: 60,
        dagerPerUke: 3,
        gyldigFra: '2025-08-01' as unknown as Date
      }
    })
    const text = extractText(result).join(' ')

    expect(text).toContain('Nåværende periode:')
    expect(text).toContain('(ikke satt)')
    expect(text).toContain('3 dager i uka')
  })

  it('viser enkel periode når neste deltakelsesmengde mangler', () => {
    const result = DeltakelsesmengdeInfo({
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
      deltakelsesprosent: null,
      dagerPerUke: 0,
      erEnkeltplass: true,
      nesteDeltakelsesmengde: null
    })

    expect(result).toBeNull()
  })
})
