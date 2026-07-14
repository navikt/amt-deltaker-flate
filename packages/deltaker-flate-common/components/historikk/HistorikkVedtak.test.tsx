import { isValidElement, ReactElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import { Vedtak } from '../../model/deltakerHistorikk'
import {
  DeltakelsesmengdeVisning,
  getDeltakelsesmengdeText
} from '../DeltakelsesmengdeVisning'
import { HistorikkVedtak } from './HistorikkVedtak'

const finnElement = (
  node: ReactNode,
  targetType: unknown
): ReactElement | null => {
  if (!isValidElement(node)) return null
  if (node.type === targetType) return node

  const children = node.props?.children
  if (!children) return null

  const nodes = Array.isArray(children) ? children : [children]
  for (const child of nodes) {
    const match = finnElement(child, targetType)
    if (match) return match
  }
  return null
}

const extractText = (node: ReactNode): string[] => {
  if (node == null || typeof node === 'boolean') return []
  if (typeof node === 'string' || typeof node === 'number')
    return [String(node)]
  if (Array.isArray(node)) return node.flatMap(extractText)
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return []
}

const lagVedtak = (): Vedtak =>
  ({
    type: 'Vedtak',
    fattet: new Date('2026-01-01'),
    bakgrunnsinformasjon: null,
    dagerPerUke: 3,
    deltakelsesprosent: 80,
    fattetAvNav: true,
    deltakelsesinnhold: { ledetekst: null, innhold: [] },
    opprettetAv: 'Navn',
    opprettetAvEnhet: 'Enhet',
    opprettet: new Date('2026-01-01')
  }) as unknown as Vedtak

describe('HistorikkVedtak - Deltakelsesmengde', () => {
  it('konfigurerer visning når tiltak støtter deltakelsesmengde', () => {
    const tree = HistorikkVedtak({
      endringsVedtak: lagVedtak(),
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      erEnkeltplass: false
    })
    const visning = finnElement(tree, DeltakelsesmengdeVisning)
    expect(visning).not.toBeNull()

    const text = getDeltakelsesmengdeText(visning!.props)
    expect(text).not.toBeNull()
    expect(extractText(visning!.props.children('dummy')).join(' ')).toContain(
      'Deltakelsesmengde'
    )
  })

  it('konfigurerer skjuling når tiltak ikke støtter deltakelsesmengde', () => {
    const tree = HistorikkVedtak({
      endringsVedtak: lagVedtak(),
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false
    })
    const visning = finnElement(tree, DeltakelsesmengdeVisning)
    expect(visning).not.toBeNull()

    const text = getDeltakelsesmengdeText(visning!.props)
    expect(text).toBeNull()
  })
})
