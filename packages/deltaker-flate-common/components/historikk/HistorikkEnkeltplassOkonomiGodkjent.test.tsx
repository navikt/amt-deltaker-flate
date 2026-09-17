import { describe, expect, it } from 'vitest'
import { HistorikkEnkeltplassOkonomiGodkjent } from './HistorikkEnkeltplassOkonomiGodkjent'
import { extractText } from '../test-utils'
import { DeltakerHistorikk } from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { PrisinformasjonType } from '../../model/prisinformasjon'

type EnkeltplassOkonomiGodkjent = Extract<
  DeltakerHistorikk,
  { type: HistorikkType.EnkeltplassOkonomiGodkjent }
>

const lagEnkeltplassOkonomiGodkjent = (
  overrides: Partial<EnkeltplassOkonomiGodkjent> = {}
): EnkeltplassOkonomiGodkjent => ({
  type: HistorikkType.EnkeltplassOkonomiGodkjent,
  endretAv: 'Bernt Besluttersen',
  endretAvEnhet: 'Nav Tiltak Oslo',
  endret: new Date('2026-10-15'),
  erForsteGodkjenning: true,
  prisinformasjon: null,
  ...overrides
})

describe('HistorikkEnkeltplassOkonomiGodkjent', () => {
  it('viser tittel og tekst for første godkjenning', () => {
    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        endringsHistorikk: lagEnkeltplassOkonomiGodkjent()
      })
    ).join(' ')

    expect(text).toContain('Opplæring godkjent')
    expect(text).toContain('Pris og betalingsbetingelser er godkjent')
  })

  it('viser prisinformasjonen ved senere godkjenning', () => {
    const text = extractText(
      HistorikkEnkeltplassOkonomiGodkjent({
        endringsHistorikk: lagEnkeltplassOkonomiGodkjent({
          erForsteGodkjenning: false,
          prisinformasjon: {
            type: PrisinformasjonType.Anskaffelse,
            pris: 20000,
            begrunnelse: null
          }
        })
      })
    ).join(' ')

    expect(text).toContain('Godkjent: Endre pris og betalingsbetingelser')
    expect(text).not.toContain('vedtak er fattet')
    expect(text).toContain('Nav har kjøpt en plass hos opplæringsstedet')
    expect(text).toContain('Totalkostnaden er')
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
