import { describe, expect, it } from 'vitest'
import { getDagerPerUkeError } from './deltakelsesmengdeValidering.ts'

describe('deltakelsesmengdeValidering', () => {
  it('validerer dager per uke basert på oppgitt maxDagerPerUke', () => {
    const maxDagerPerUke = 7

    expect(
      getDagerPerUkeError({
        deltakelsesprosent: null,
        dagerPerUke: maxDagerPerUke,
        maxDagerPerUke
      })
    ).toBeUndefined()

    expect(
      getDagerPerUkeError({
        deltakelsesprosent: null,
        dagerPerUke: maxDagerPerUke + 1,
        maxDagerPerUke
      })
    ).toBe(`Dager per uke må være et helt tall fra 1 til ${maxDagerPerUke}`)
  })
})
