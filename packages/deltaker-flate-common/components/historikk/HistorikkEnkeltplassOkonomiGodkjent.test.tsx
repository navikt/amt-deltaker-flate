import { describe, expect, it } from 'vitest'
import { HistorikkEnkeltplassOkonomiGodkjent } from './HistorikkEnkeltplassOkonomiGodkjent'
import { extractText } from '../test-utils'
import { DeltakerHistorikk } from '../../model/deltakerHistorikk'

const lagEnkeltplassOkonomiGodkjent = (): Extract<
  DeltakerHistorikk,
  { type: 'EnkeltplassOkonomiGodkjent' }
> =>
  ({
    type: 'EnkeltplassOkonomiGodkjent',
    endretAv: 'Bernt Besluttersen',
    endretAvEnhet: 'Nav Tiltak Oslo',
    endret: new Date('2026-10-15')
  }) as unknown as Extract<
    DeltakerHistorikk,
    { type: 'EnkeltplassOkonomiGodkjent' }
  >

describe('HistorikkEnkeltplassOkonomiGodkjent', () => {
  it('rendrer tittel og innhold korrekt', () => {
    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        endringsHistorikk: lagEnkeltplassOkonomiGodkjent()
      })
    ).join(' ')

    expect(text).toContain('Opplæring godkjent')
    expect(text).toContain('Pris og betalingsbetingelser er godkjent')
  })

  it('viser når og av hvem økonomien ble godkjent', () => {
    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        endringsHistorikk: lagEnkeltplassOkonomiGodkjent()
      })
    ).join(' ')

    expect(text).toContain('Bernt Besluttersen')
    expect(text).toContain('Nav Tiltak Oslo')
  })
})
