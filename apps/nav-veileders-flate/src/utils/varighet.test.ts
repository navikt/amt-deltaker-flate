import { describe, expect, it } from 'vitest'
import { kalkulerSluttdato, varigheter, VarighetValg } from './varighet.ts'

describe('kalkulerSluttdato', () => {
  const gyldigDato = new Date(2024, 0, 20)
  const forventetDato = new Date(2024, 1, 17)

  it('Returnerer riktig sluttdato for gyldig dato og varighet', () =>
    expect(kalkulerSluttdato(gyldigDato, varigheter[VarighetValg.FIRE_UKER])).toStrictEqual(
      forventetDato
    ))
})
