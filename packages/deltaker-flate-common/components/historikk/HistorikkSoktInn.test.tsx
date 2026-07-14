import { isValidElement, ReactElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import { Innsok } from '../../model/deltakerHistorikk'
import {
  DeltakelsesmengdeVisning,
  getDeltakelsesmengdeText
} from '../DeltakelsesmengdeVisning'
import { HistorikkSoktInn } from './HistorikkSoktInn'

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

const lagInnsok = (dagerPerUkeVedInnsok: number | null = 3): Innsok =>
  ({
    type: 'InnsokPaaFellesOppstart',
    innsokt: new Date('2026-01-01'),
    innsoktAv: 'Navn',
    innsoktAvEnhet: 'Enhet',
    startdato: new Date('2026-01-01'),
    sluttdato: new Date('2026-06-01'),
    deltakelsesinnholdVedInnsok: { ledetekst: null, innhold: [] },
    opplaringKategorisering: null,
    utkastDelt: null,
    utkastGodkjentAvNav: true,
    dagerPerUkeVedInnsok,
    prisinformasjonVedInnsok: null
  }) as unknown as Innsok

describe('HistorikkSoktInn - Deltakelsesmengde', () => {
  it('konfigurerer visning når tiltak støtter deltakelsesmengde', () => {
    const tree = HistorikkSoktInn({
      soktInnHistorikk: lagInnsok(3),
      tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
      erEnkeltplass: true
    })
    const visning = finnElement(tree, DeltakelsesmengdeVisning)
    expect(visning).not.toBeNull()

    const text = getDeltakelsesmengdeText(visning!.props)
    expect(text).not.toBeNull()
    expect(extractText(visning!.props.children('dummy')).join(' ')).toContain(
      'Deltakelsesmengde'
    )
  })

  it('konfigurerer skjuling når deltaker ikke er enkeltplass', () => {
    const tree = HistorikkSoktInn({
      soktInnHistorikk: lagInnsok(3),
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false
    })
    const visning = finnElement(tree, DeltakelsesmengdeVisning)
    expect(visning).toBeNull()
  })
})
