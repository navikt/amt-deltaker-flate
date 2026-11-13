import dayjs from 'dayjs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  beregnEstimertTotalsum,
  DATO_FORMATS,
  fjernUgyldigeTegn,
  getDayjsFromString,
  harGyldigDatoformat,
  harDeltakelsesmengde,
  haveSameContents,
  logServerError,
  NOK_FORMATTER
} from './utils'
import { Tiltakskode } from '../model/deltaker'
import { PrisinformasjonType, Tilskuddstype } from '../model/prisinformasjon'

afterEach(() => vi.restoreAllMocks())

describe('logServerError', () => {
  it.each([400, 401, 403, 404, 409])(
    'does not log client response status %s',
    (status) => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      logServerError('Request failed', status)

      expect(consoleError).not.toHaveBeenCalled()
    }
  )

  it('logs server response status', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const deltakerlisteId = '04aba3db-2085-4af1-b707-06e842193d83'
    logServerError('Request failed', 503, { deltakerlisteId })

    expect(consoleError).toHaveBeenCalledWith('AMT_LOGS: Request failed', [
      503,
      { deltakerlisteId }
    ])
  })
})

describe('harGyldigDatoformat', () => {
  it.each([
    '32.01.2027',
    '31.02.2027',
    '00.13.2027',
    '32012027',
    '320127',
    '32/01/2027',
    '31-02-2027'
  ])('godtar formatet til %s uavhengig av kalenderdatoen', (value) => {
    expect(harGyldigDatoformat(value)).toBe(true)
  })

  it.each([
    '',
    '2026-03-01',
    '2027-02-31',
    '01_03_2027',
    '1_3_2027',
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
  it.each(DATO_FORMATS)('godtar og parser datoformatet %s', (format) => {
    const expectedDate = dayjs(new Date(2027, 2, 1))
    const value = expectedDate.format(format)

    expect(harGyldigDatoformat(value)).toBe(true)
    expect(getDayjsFromString(value)?.toDate()).toEqual(expectedDate.toDate())
  })

  it.each([
    '31.02.2027',
    '29.02.2027',
    '31022027',
    '310227',
    '2026-03-01',
    '2027-02-31',
    '31/02/2027',
    '29/02/2027',
    '31-02-2027',
    '29-02-27',
    '01_03_2027'
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
