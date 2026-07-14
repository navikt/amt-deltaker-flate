import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import { Innsok } from '../../model/deltakerHistorikk'
import {
  DeltakelsesmengdeBodyLongSection,
  getDeltakelsesmengdeText
} from '../DeltakelsesmengdeVisning'
import { HistorikkSoktInn } from './HistorikkSoktInn'
import { finnElement } from './test-utils'

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
    const visning = finnElement(tree, DeltakelsesmengdeBodyLongSection)
    expect(visning).not.toBeNull()

    const text = getDeltakelsesmengdeText(visning!.props)
    expect(text).not.toBeNull()
    expect(visning!.props.headingText ?? 'Deltakelsesmengde').toBe(
      'Deltakelsesmengde'
    )
  })

  it('konfigurerer skjuling når deltaker ikke er enkeltplass', () => {
    const tree = HistorikkSoktInn({
      soktInnHistorikk: lagInnsok(3),
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false
    })
    const visning = finnElement(tree, DeltakelsesmengdeBodyLongSection)
    expect(visning).toBeNull()
  })
})
