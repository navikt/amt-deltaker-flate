import { describe, expect, it } from 'vitest'
import { Tiltakskode } from '../../model/deltaker'
import { Innsok } from '../../model/deltakerHistorikk'
import { PrisinformasjonType } from '../../model/prisinformasjon'
import { HistorikkSoktInn } from './HistorikkSoktInn'
import { extractText } from '../test-utils'

const lagInnsok = (
  dagerPerUkeVedInnsok: number | null = 3,
  prisinformasjonVedInnsok = null
): Innsok =>
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
    prisinformasjonVedInnsok
  }) as Innsok

describe('HistorikkSoktInn - Deltakelsesmengde', () => {
  it('viser deltakelsesmengde når tiltak støtter det', () => {
    const text = extractText(
      HistorikkSoktInn({
        soktInnHistorikk: lagInnsok(3, {
          type: PrisinformasjonType.Anskaffelse,
          pris: 25000
        }),
        tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
        erEnkeltplass: true
      })
    ).join(' ')

    expect(text).toContain('Dato:')
    expect(text).toContain('01.01.2026 – 01.06.2026')
    expect(text).toContain('Deltakelsesmengde')
    expect(text).toContain('3 dager i uka')
    expect(text).toContain('Pris og betalingsbetingelser')
    expect(text).toMatch(/Totalkostnaden er\s+25\s*000\s+kroner/)
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    const text = extractText(
      HistorikkSoktInn({
        soktInnHistorikk: lagInnsok(3),
        tiltakskode: Tiltakskode.OPPFOLGING,
        erEnkeltplass: false
      })
    ).join(' ')

    expect(text).toContain('Dato:')
    expect(text).toContain('01.01.2026 – 01.06.2026')
    expect(text).not.toContain('Deltakelsesmengde')
    expect(text).not.toContain('Pris og betalingsbetingelser')
  })
})
