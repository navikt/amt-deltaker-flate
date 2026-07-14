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
