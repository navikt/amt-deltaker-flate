import { describe, it, expect } from 'vitest'
import {
  fjernUgyldigeTegn,
  getDayjsFromString,
  haveSameContents
} from './utils'

describe('getDayjsFromString', () => {
  it('returnerer undefined for undefined', () => {
    expect(getDayjsFromString(undefined)).toBeUndefined()
  })

  it('returnerer undefined for null', () => {
    expect(getDayjsFromString(null)).toBeUndefined()
  })

  it('returnerer undefined for tom streng', () => {
    expect(getDayjsFromString('')).toBeUndefined()
  })

  it('returnerer undefined for ugyldig dato', () => {
    expect(getDayjsFromString('ikke-en-dato')).toBeUndefined()
  })

  it('returnerer undefined for 32.01.2026', () => {
    expect(getDayjsFromString('32.01.2026')).toBeUndefined()
  })

  it('parser DD.MM.YYYY - 01.03.2026', () => {
    const result = getDayjsFromString('01.03.2026')
    expect(result?.isValid()).toBeTruthy()
    expect(result?.format('YYYY-MM-DD')).toBe('2026-03-01')
  })

  it('parser D.M.YYYY - 1.3.2026', () => {
    const result = getDayjsFromString('1.3.2026')
    expect(result?.isValid()).toBeTruthy()
    expect(result?.format('YYYY-MM-DD')).toBe('2026-03-01')
  })

  it('parser D.MM.YYYY - 1.03.2026', () => {
    const result = getDayjsFromString('1.03.2026')
    expect(result?.isValid()).toBeTruthy()
    expect(result?.format('YYYY-MM-DD')).toBe('2026-03-01')
  })

  it('parser DD.M.YYYY - 01.3.2026', () => {
    const result = getDayjsFromString('01.3.2026')
    expect(result?.format('YYYY-MM-DD')).toBe('2026-03-01')
  })

  it('parser D.M.YY - 1.3.26', () => {
    const result = getDayjsFromString('1.3.26')
    expect(result?.format('YYYY-MM-DD')).toBe('2026-03-01')
  })

  it('parser DD.MM.YY - 01.03.26', () => {
    const result = getDayjsFromString('01.03.26')
    expect(result?.format('YYYY-MM-DD')).toBe('2026-03-01')
  })

  it('parser YYYY-MM-DD - 2026-03-01', () => {
    const result = getDayjsFromString('2026-03-01')
    expect(result?.format('YYYY-MM-DD')).toBe('2026-03-01')
  })

  it('parser 01.12.2025', () => {
    const result = getDayjsFromString('01.12.2025')
    expect(result?.format('YYYY-MM-DD')).toBe('2025-12-01')
  })

  it('parser 1.1.2026', () => {
    const result = getDayjsFromString('1.1.2026')
    expect(result?.format('YYYY-MM-DD')).toBe('2026-01-01')
  })

  it('returnerer undefined for 00.01.2026', () => {
    expect(getDayjsFromString('00.01.2026')).toBeUndefined()
  })

  it('returnerer undefined for 01.00.2026', () => {
    expect(getDayjsFromString('01.00.2026')).toBeUndefined()
  })
})

describe('fjernUgyldigeTegn', () => {
  it('Fjerner ingenting fra abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ1234567890!"#$%&/()=?,.;:-_@', () =>
    expect(
      fjernUgyldigeTegn(
        'abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ1234567890!"#$%&/()=?,.;:-_@'
      )
    ).toEqual(
      'abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ1234567890!"#$%&/()=?,.;:-_@'
    ))
  it('Fjerner ingenting fra !"#$%&/()=?*<>', () =>
    expect(fjernUgyldigeTegn('!"#$%&/()=?*<><>\'`')).toEqual(
      '!"#$%&/()=?*<><>\'`'
    ))
  it('Fjerner 👍 fra 👍', () => expect(fjernUgyldigeTegn('👍')).toEqual(''))
  it('Fjerner 🎄 fra a🎄b;', () =>
    expect(fjernUgyldigeTegn('a🎄b;')).toEqual('ab;'))
})

describe('haveSameContents', () => {
  it('Returenere true for listene [] og []', () =>
    expect(haveSameContents([], [])).toBeTruthy())
  it('Returenere true for listene [a, b, 1], [1, a, b]', () =>
    expect(haveSameContents(['a', 'b', 1], [1, 'a', 'b'])).toBeTruthy())
  it('Returenere false for listene [a, b] og [a]', () =>
    expect(haveSameContents(['a', 'b'], ['a'])).toBeFalsy())
  it('Returenere false for listene [1] og [a]', () =>
    expect(haveSameContents([1], ['a'])).toBeFalsy())
})
