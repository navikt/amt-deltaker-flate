import { describe, expect, it } from 'vitest'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../../../../utils/endre-deltaker-utils'
import {
  gyldigObligatoriskBegrunnelse,
  validerObligatoriskBegrunnelse
} from './begrunnelseValidering'

describe('Validering av obligatorisk begrunnelse', () => {
  it('avviser en tom begrunnelse', async () => {
    await expect(validerObligatoriskBegrunnelse('')).rejects.toBe(
      'Begrunnelse mangler'
    )
    expect(gyldigObligatoriskBegrunnelse('')).toBe(false)
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
})
