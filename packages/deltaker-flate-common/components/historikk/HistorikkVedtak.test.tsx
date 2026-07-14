import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import { Vedtak } from '../../model/deltakerHistorikk'
import { HistorikkVedtak } from './HistorikkVedtak'
import { extractText } from './test-utils'

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
    const text = extractText(
      HistorikkVedtak({
        endringsVedtak: lagVedtak(),
        tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
        erEnkeltplass: false
      })
    ).join(' ')

    expect(text).toContain('Deltakelsesmengde')
    expect(text).toContain('80')
  })

  it('skjuler visning når tiltak ikke støtter deltakelsesmengde', () => {
    const text = extractText(
      HistorikkVedtak({
        endringsVedtak: lagVedtak(),
        tiltakskode: Tiltakskode.OPPFOLGING,
        erEnkeltplass: false
      })
    ).join(' ')

    expect(text).not.toContain('Deltakelsesmengde')
  })
})
