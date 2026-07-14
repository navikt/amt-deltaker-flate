import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import { Vedtak } from '../../model/deltakerHistorikk'
import {
  DeltakelsesmengdeBodyLongSection,
  getDeltakelsesmengdeText
} from '../DeltakelsesmengdeVisning'
import { HistorikkVedtak } from './HistorikkVedtak'
import { finnElement } from './test-utils'

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
    const visning = finnElement(tree, DeltakelsesmengdeBodyLongSection)
    expect(visning).not.toBeNull()

    const text = getDeltakelsesmengdeText(visning!.props)
    expect(text).not.toBeNull()
    expect(visning!.props.headingText ?? 'Deltakelsesmengde').toBe(
      'Deltakelsesmengde'
    )
  })

  it('konfigurerer skjuling når tiltak ikke støtter deltakelsesmengde', () => {
    const tree = HistorikkVedtak({
      endringsVedtak: lagVedtak(),
      tiltakskode: Tiltakskode.OPPFOLGING,
      erEnkeltplass: false
    })
    const visning = finnElement(tree, DeltakelsesmengdeBodyLongSection)
    expect(visning).not.toBeNull()

    const text = getDeltakelsesmengdeText(visning!.props)
    expect(text).toBeNull()
  })
})
