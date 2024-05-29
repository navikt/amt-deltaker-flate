import { describe, expect, it } from 'vitest'
import { kalkulerSluttdato, getVarighet, VarighetValg } from './varighet.tsx'

describe('kalkulerSluttdato', () => {
  const gyldigDato = new Date(2024, 0, 20)
  const forventetDato = new Date(2024, 1, 17)

  it('Returnerer riktig sluttdato for gyldig dato og varighet', () =>
    expect(
      kalkulerSluttdato(gyldigDato, getVarighet(VarighetValg.FIRE_UKER))
    ).toStrictEqual(forventetDato))
})
