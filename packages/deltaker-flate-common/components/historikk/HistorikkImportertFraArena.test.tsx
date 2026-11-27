import { describe, expect, it } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from '../../model/deltaker'
import { importertFraArena } from '../../model/deltakerHistorikk'
import { HistorikkImportertFraArena } from './HistorikkImportertFraArena'
import { extractText } from '../test-utils'

const lagImportertFraArena = (): importertFraArena =>
  ({
    type: 'ImportertFraArena',
    importertDato: new Date('2026-01-01'),
    startdato: new Date('2026-01-10'),
    sluttdato: new Date('2026-02-10'),
    deltakelsesprosent: 80,
    dagerPerUke: 3,
    status: { type: DeltakerStatusType.DELTAR, aarsak: null }
  }) as unknown as importertFraArena

describe('HistorikkImportertFraArena - Deltakelsesmengde', () => {
  it.each([
    { dagerPerUke: 3, forventet: '3 dager i uka' },
    { dagerPerUke: null, forventet: null }
  ])(
    'viser bare registrert mengde i Nav med $dagerPerUke dager og uten prosent',
    ({ dagerPerUke, forventet }) => {
      const text = extractText(
        HistorikkImportertFraArena({
          deltakelseVedImport: {
            ...lagImportertFraArena(),
            deltakelsesprosent: null,
            dagerPerUke
          },
          tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
          erEnkeltplass: false
        })
      ).join(' ')

      expect(text).not.toContain('%')
      if (forventet) {
        expect(text).toContain(`Deltakelsesmengde: ${forventet}`)
      } else {
        expect(text).not.toContain('Deltakelsesmengde:')
      }
      expect(text).toContain('Dato: 10.01.2026 - 10.02.2026')
      expect(text).toContain('Status:')
    }
  )

  it.each([
    { dagerPerUke: 3, forventet: '100\u00a0% fordelt på 3 dager i uka' },
    { dagerPerUke: null, forventet: '100\u00a0%' }
  ])(
    'viser registrert hundre prosent med $dagerPerUke dager per uke',
    ({ dagerPerUke, forventet }) => {
      const text = extractText(
        HistorikkImportertFraArena({
          deltakelseVedImport: {
            ...lagImportertFraArena(),
            deltakelsesprosent: 100,
            dagerPerUke
          },
          tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
          erEnkeltplass: false
        })
      ).join(' ')

      expect(text).toContain(`Deltakelsesmengde: ${forventet}`)
    }
  )

  it('konfigurerer inline-visning når tiltak støtter deltakelsesmengde', () => {
    const text = extractText(
      HistorikkImportertFraArena({
        deltakelseVedImport: lagImportertFraArena(),
        tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
        erEnkeltplass: false
      })
    ).join(' ')

    expect(text).toContain('Deltakelsesmengde:')
    expect(text).toContain('80')
  })

  it('konfigurerer skjuling når tiltak ikke støtter deltakelsesmengde', () => {
    const text = extractText(
      HistorikkImportertFraArena({
        deltakelseVedImport: lagImportertFraArena(),
        tiltakskode: Tiltakskode.OPPFOLGING,
        erEnkeltplass: false
      })
    ).join(' ')

    expect(text).not.toContain('Deltakelsesmengde:')
  })
})
