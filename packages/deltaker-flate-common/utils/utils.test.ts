import { describe, it, expect } from 'vitest'
import { fjernUgyldigeTegn, haveSameContents } from './utils'

describe('fjernUgyldigeTegn', () => {
  it('Fjerner ingenting fra 100æøåÅ', () =>
    expect(fjernUgyldigeTegn('100æøåÅ')).toEqual('100æøåÅ'))
  it('Fjerner ingenting fra !"#$%&/()=?*<>', () =>
    expect(fjernUgyldigeTegn('!"#$%&/()=?*<><>\'`')).toEqual(
      '!"#$%&/()=?*<><>\'`'
    ))
  it('Fjerner 👍 fra 👍', () => expect(fjernUgyldigeTegn('👍')).toEqual(''))
  it('Fjerner 🎄; fra a🎄b;', () =>
    expect(fjernUgyldigeTegn('a🎄b;')).toEqual('ab'))
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
