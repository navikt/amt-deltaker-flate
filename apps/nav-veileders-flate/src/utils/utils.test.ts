import { describe, it, expect } from 'vitest'
import {
  erGyldigProsent,
  isValidFloatInRange,
  erGyldigDagerPerUke
} from './utils'
import { EMDASH, formatDateFromString } from 'deltaker-flate-common'

describe('isValidFloatInRange', () => {
  it('Returnerer true for gyldig float 100', () =>
    expect(isValidFloatInRange('100', 0, 100)).toBeTruthy())
  it('Returnerer true for gyldig float med komma 10,5', () =>
    expect(isValidFloatInRange('10,5', 0, 100)).toBeTruthy())
  it('Returnerer true for gyldig float med punktum 10.5', () =>
    expect(isValidFloatInRange('10.5', 0, 100)).toBeTruthy())
  it('Returnerer true for gyldig float med e 12e-2', () =>
    expect(isValidFloatInRange('12e-2', 0, 100)).toBeTruthy())
  it('Returnerer true for gyldig float med bokstaver bakkerst 12abc1', () =>
    expect(isValidFloatInRange('12abc1', 0, 100)).toBeTruthy())
  it('Returnerer true for gyldig float med spesialtegn bakkerst 12a!', () =>
    expect(isValidFloatInRange('12a!', 0, 100)).toBeTruthy())

  it('Returnerer false for ugyldig float mindre enn range', () =>
    expect(isValidFloatInRange('10', 11, 15)).toBeFalsy())
  it('Returnerer false for ugyldig float høyere enn range', () =>
    expect(isValidFloatInRange('10', 0, 9)).toBeFalsy())
  it('Returnerer false for ugyldig float med bokstaver foran a12', () =>
    expect(isValidFloatInRange('a12', 0, 100)).toBeFalsy())
  it('Returnerer false for ugyldig float med spesialtegn foran &12', () =>
    expect(isValidFloatInRange('&12', 0, 100)).toBeFalsy())
})

describe('erGyldigProsent', () => {
  it('Returnerer true for gyldig prosent 100', () =>
    expect(erGyldigProsent('100')).toBeTruthy())
  it('Returnerer true for gyldig prosent med komma 10,5', () =>
    expect(erGyldigProsent('10,5')).toBeTruthy())
  it('Returnerer true for gyldig prosent med punktum 10.5', () =>
    expect(erGyldigProsent('10.5')).toBeTruthy())
  it('Returnerer true for gyldig prosent med bokstaver bakkerst 12abc1', () =>
    expect(erGyldigProsent('12abc1')).toBeTruthy())
  it('Returnerer true for gyldig prosent med spesialtegn bakkerst 12a!', () =>
    expect(erGyldigProsent('12a!')).toBeTruthy())
  it('Returnerer true for nedre grense 1', () =>
    expect(erGyldigProsent('1')).toBeTruthy())

  it('Returnerer false for ugyldig prosent -1', () =>
    expect(erGyldigProsent('-1')).toBeFalsy())
  it('Returnerer false for ugyldig prosent 101', () =>
    expect(erGyldigProsent('101')).toBeFalsy())
  it('Returnerer false for ugyldig prosent med bokstaver foran a12', () =>
    expect(erGyldigProsent('a12')).toBeFalsy())
  it('Returnerer false for ugyldig prosent med spesialtegn foran &12', () =>
    expect(erGyldigProsent('&12')).toBeFalsy())
  it('Returnerer false for 0 (deltakelsesprosent må være minst 1)', () =>
    expect(erGyldigProsent('0')).toBeFalsy())
})

describe('erGyldigDagerPerUke', () => {
  it('Returnerer true for gyldig dager per uke 1', () =>
    expect(erGyldigDagerPerUke('1')).toBeTruthy())
  it('Returnerer true for gyldig dager per uke med komma 1,5', () =>
    expect(erGyldigDagerPerUke('1,5')).toBeTruthy())
  it('Returnerer true for gyldig dager per uke med punktum 1.5', () =>
    expect(erGyldigDagerPerUke('1.5')).toBeTruthy())
  it('Returnerer true for gyldig dager per uke med bokstaver bakkerst 1abc1', () =>
    expect(erGyldigDagerPerUke('1abc1')).toBeTruthy())
  it('Returnerer true for gyldig dager per uke med spesialtegn bakkerst 1a!', () =>
    expect(erGyldigDagerPerUke('1a!')).toBeTruthy())
  it('Returnerer true for øvre grense 5', () =>
    expect(erGyldigDagerPerUke('5')).toBeTruthy())

  it('Returnerer false for ugyldig dager per uke -1', () =>
    expect(erGyldigDagerPerUke('-1')).toBeFalsy())
  it('Returnerer false for 6 (maks er 5 dager per uke)', () =>
    expect(erGyldigDagerPerUke('6')).toBeFalsy())
  it('Returnerer false for 7 (maks er 5 dager per uke)', () =>
    expect(erGyldigDagerPerUke('7')).toBeFalsy())
  it('Returnerer false for ugyldig dager per uke 8', () =>
    expect(erGyldigDagerPerUke('8')).toBeFalsy())
  it('Returnerer false for 0 (dager per uke må være minst 1)', () =>
    expect(erGyldigDagerPerUke('0')).toBeFalsy())
  it('Returnerer false for ugyldig dager per uke med bokstaver foran a1', () =>
    expect(erGyldigDagerPerUke('a1')).toBeFalsy())
  it('Returnerer false for ugyldig dager per uke med spesialtegn foran &1', () =>
    expect(erGyldigDagerPerUke('&1')).toBeFalsy())
})

describe('formatDateFromString', () => {
  it('Formates valid date string', () =>
    expect(formatDateFromString('11.11.2021')).toBe('11.11.2021'))
  it('Formates valid datetime string', () =>
    expect(formatDateFromString('2024-01-30T08:56:20.576553')).toBe(
      '30.01.2024'
    ))
  it('Formates unvalid date string to —', () =>
    expect(formatDateFromString('')).toBe(EMDASH))
  it('Formates unvalid date string to —', () =>
    expect(formatDateFromString('aa')).toBe(EMDASH))
  it('Formates null date to —', () =>
    expect(formatDateFromString('aa')).toBe(EMDASH))
})
