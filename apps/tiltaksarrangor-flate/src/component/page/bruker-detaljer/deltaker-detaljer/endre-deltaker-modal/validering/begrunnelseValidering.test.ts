import { describe, expect, it } from 'vitest'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../../../../utils/endre-deltaker-utils'
import {
  gyldigObligatoriskBegrunnelse,
  validerObligatoriskBegrunnelse
} from './begrunnelseValidering'

describe('Validering av obligatorisk begrunnelse', () => {
  it.each(['', ' ', '   ', '\t', '\n', ' \t\n ', '\u00a0'])(
    'avviser en begrunnelse med bare blanke tegn: %j',
    async (begrunnelse) => {
      await expect(validerObligatoriskBegrunnelse(begrunnelse)).rejects.toBe(
        'Begrunnelse mangler'
      )
      expect(gyldigObligatoriskBegrunnelse(begrunnelse)).toBe(false)
    }
  )

  it('godtar tekst med blanke tegn rundt uten å endre innholdet', async () => {
    const begrunnelse = ' \nEn begrunnelse\t '
    await expect(validerObligatoriskBegrunnelse(begrunnelse)).resolves.toBe(
      begrunnelse
    )
    expect(gyldigObligatoriskBegrunnelse(begrunnelse)).toBe(true)
  })

  it('godtar en begrunnelse på tegngrensen', async () => {
    const begrunnelse = 'a'.repeat(BEGRUNNELSE_MAKS_TEGN)
    await expect(validerObligatoriskBegrunnelse(begrunnelse)).resolves.toBe(
      begrunnelse
    )
    expect(gyldigObligatoriskBegrunnelse(begrunnelse)).toBe(true)
  })

  it('viser den konfigurerte tegngrensen når den overskrides', async () => {
    const begrunnelse = 'a'.repeat(BEGRUNNELSE_MAKS_TEGN + 1)
    await expect(validerObligatoriskBegrunnelse(begrunnelse)).rejects.toBe(
      `Begrunnelsen kan ikke være over ${BEGRUNNELSE_MAKS_TEGN} tegn`
    )
    expect(gyldigObligatoriskBegrunnelse(begrunnelse)).toBe(false)
  })

  it('teller blanke tegn med i tegngrensen', async () => {
    const begrunnelse = ` ${'a'.repeat(BEGRUNNELSE_MAKS_TEGN)}`
    await expect(validerObligatoriskBegrunnelse(begrunnelse)).rejects.toBe(
      `Begrunnelsen kan ikke være over ${BEGRUNNELSE_MAKS_TEGN} tegn`
    )
    expect(gyldigObligatoriskBegrunnelse(begrunnelse)).toBe(false)
  })
})
