import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import { Innsok } from '../../model/deltakerHistorikk'
import { HistorikkSoktInn } from './HistorikkSoktInn'
import { extractText } from './test-utils'

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
    const text = extractText(
      HistorikkSoktInn({
        soktInnHistorikk: lagInnsok(3),
        tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
        erEnkeltplass: true
      })
    ).join(' ')

    expect(text).toContain('Deltakelsesmengde')
    expect(text).toContain('3 dager i uka')
  })

  it('konfigurerer skjuling når deltaker ikke er enkeltplass', () => {
    const text = extractText(
      HistorikkSoktInn({
        soktInnHistorikk: lagInnsok(3),
        tiltakskode: Tiltakskode.OPPFOLGING,
        erEnkeltplass: false
      })
    ).join(' ')

    expect(text).not.toContain('Deltakelsesmengde')
  })
})
