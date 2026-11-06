import { describe, expect, it } from 'vitest'
import {
  beregnEstimertTotalsum,
  fjernUgyldigeTegn,
  getDayjsFromString,
  harGyldigDatoformat,
  harDeltakelsesmengde,
  haveSameContents,
  NOK_FORMATTER
} from './utils'
import { Tiltakskode } from '../model/deltaker'
import { PrisinformasjonType, Tilskuddstype } from '../model/prisinformasjon'

describe('harGyldigDatoformat', () => {
  it.each([
    '32.01.2027',
    '31.02.2027',
    '00.13.2027',
    '32012027',
    '320127',
    '1.3.27',
    '1.03.2027',
    '01.3.2027',
    '2027-02-31'
  ])('godtar formatet til %s uavhengig av kalenderdatoen', (value) => {
    expect(harGyldigDatoformat(value)).toBe(true)
  })

  it.each([
    '',
    '01/03/2027',
    '1-3-2027',
    '01.01.200',
    '001.01.2027',
    '0103202',
    'aa.bb.cccc',
    '01.03.2027tekst',
    ' 01.03.2027'
  ])('avviser ukjent format %s', (value) => {
    expect(harGyldigDatoformat(value)).toBe(false)
  })
})

describe('getDayjsFromString', () => {
  it.each(['01032027', '010327'])('parser kompakt dato %s', (value) => {
    expect(getDayjsFromString(value)?.format('YYYY-MM-DD')).toBe('2027-03-01')
  })

  it.each([
    '31.02.2027',
    '29.02.2027',
    '31022027',
    '310227',
    '2027-02-31',
    '01/03/2027'
  ])('avviser ugyldig dato eller ukjent format %s', (value) => {
    expect(getDayjsFromString(value)).toBeUndefined()
  })

  it('godtar skuddårsdag i kompakt format', () => {
    expect(getDayjsFromString('29022028')?.format('YYYY-MM-DD')).toBe(
      '2028-02-29'
    )
  })

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

describe('harDeltakelsesmengde', () => {
  it.each([
    Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
    Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
  ])('returnerer true for %s med erEnkeltplass=false', (kode) => {
    expect(
      harDeltakelsesmengde({ tiltakskode: kode, erEnkeltplass: false })
    ).toBe(true)
  })

  it.each([
    Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
    Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
  ])('returnerer true for %s med erEnkeltplass=true', (kode) => {
    expect(
      harDeltakelsesmengde({ tiltakskode: kode, erEnkeltplass: true })
    ).toBe(true)
  })

  it.each(
    Object.values(Tiltakskode).filter(
      (kode) =>
        kode !== Tiltakskode.ARBEIDSFORBEREDENDE_TRENING &&
        kode !== Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
    )
  )('returnerer false for %s med erEnkeltplass=false', (kode) => {
    expect(
      harDeltakelsesmengde({ tiltakskode: kode, erEnkeltplass: false })
    ).toBe(false)
  })

  it.each([
    Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
    Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING,
    Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
    Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
    Tiltakskode.STUDIESPESIALISERING,
    Tiltakskode.FAG_OG_YRKESOPPLAERING,
    Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING,
    Tiltakskode.HOYERE_UTDANNING,
    Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING,
    Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING
  ])(
    'returnerer true for opplæringstiltak %s med erEnkeltplass=true',
    (kode) => {
      expect(
        harDeltakelsesmengde({ tiltakskode: kode, erEnkeltplass: true })
      ).toBe(true)
    }
  )

  it.each([
    Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
    Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING,
    Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
    Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
    Tiltakskode.STUDIESPESIALISERING,
    Tiltakskode.FAG_OG_YRKESOPPLAERING,
    Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING,
    Tiltakskode.HOYERE_UTDANNING,
    Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING,
    Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING
  ])(
    'returnerer false for opplæringstiltak %s med erEnkeltplass=false',
    (kode) => {
      expect(
        harDeltakelsesmengde({ tiltakskode: kode, erEnkeltplass: false })
      ).toBe(false)
    }
  )
})

describe('beregnEstimertTotalsum', () => {
  it('returnerer 0 når prisinformasjon er null', () => {
    expect(beregnEstimertTotalsum(null)).toBe(0)
  })

  it('returnerer 0 når prisinformasjon ikke er tilskudd', () => {
    expect(
      beregnEstimertTotalsum({
        type: PrisinformasjonType.Anskaffelse,
        pris: 1000
      })
    ).toBe(0)
  })

  it('summerer beløp for tilskudd', () => {
    expect(
      beregnEstimertTotalsum({
        type: PrisinformasjonType.Tilskudd,
        tilskudd: [
          { type: Tilskuddstype.SKOLEPENGER, pris: 1000 },
          { type: Tilskuddstype.SEMESTERAVGIFT, pris: 2500 }
        ],
        tilleggsopplysninger: null
      })
    ).toBe(3500)
  })
})

describe('NOK_FORMATTER', () => {
  it('formatterer heltall med norsk tusenskille', () => {
    const formatert = NOK_FORMATTER.format(1234567).replace(/\s/g, ' ')
    expect(formatert).toBe('1 234 567')
  })

  it('formatterer desimaltall med norsk komma', () => {
    const formatert = NOK_FORMATTER.format(1234.5).replace(/\s/g, ' ')
    expect(formatert).toBe('1 234,5')
  })
})
