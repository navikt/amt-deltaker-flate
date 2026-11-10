import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getMockDeltaker } from '../mocks/mockDeltakere'
import {
  MAX_START_DATO,
  SLUTTDATO_ETTER_STARTDATO_FEILMELDING,
  START_DATO_ETTER_5_AAR_FEILMELDING,
  START_DATO_FOER_2000_FEILMELDING,
  UGYLDIG_DATO,
  UGYLDIG_DATO_FORMAT
} from '../utils/varighet'
import {
  createPameldingEnkeltplassFormSchema,
  dagerPerUkeFeilmelding,
  DATE_FORMAT,
  DATO_PAAKREVD_FEILMELDINGER,
  generateFormDefaultValues,
  parsePameldingDato
} from './PameldingEnkeltplassFormValues'

const deltaker = getMockDeltaker()
const schema = createPameldingEnkeltplassFormSchema(deltaker)
const gyldigeVerdier = {
  ...generateFormDefaultValues(deltaker),
  innhold: 'Beskrivelse av opplæringen',
  startdato: '01.03.2027',
  sluttdato: '31.03.2027'
}

describe('datovalidering for enkeltplass', () => {
  describe.each(['x', Number.NaN])(
    'med ugyldig dagerPerUke=%s',
    (dagerPerUke) => {
      it.each([
        [
          '',
          DATO_PAAKREVD_FEILMELDINGER.startdato,
          DATO_PAAKREVD_FEILMELDINGER.sluttdato
        ],
        ['01_03_2027', UGYLDIG_DATO_FORMAT, UGYLDIG_DATO_FORMAT],
        ['32.01.2027', UGYLDIG_DATO, UGYLDIG_DATO]
      ])('viser også datofeil for %s', (value, startMessage, sluttMessage) => {
        const result = schema.safeParse({
          ...gyldigeVerdier,
          dagerPerUke,
          startdato: value,
          sluttdato: value
        })

        expect(result.success).toBe(false)
        if (!result.success) {
          expect(
            result.error.issues.map(({ path, message }) => ({ path, message }))
          ).toEqual([
            { path: ['startdato'], message: startMessage },
            { path: ['sluttdato'], message: sluttMessage },
            { path: ['dagerPerUke'], message: dagerPerUkeFeilmelding }
          ])
        }
      })
    }
  )

  describe.each(['startdato', 'sluttdato'] as const)('%s', (felt) => {
    const parseDato = (value: string) =>
      schema.safeParse({ ...gyldigeVerdier, [felt]: value })

    it.each([
      '01.03.2027',
      '01032027',
      '01.03.27',
      '010327',
      '1.3.2027',
      '1.03.2027',
      '01.3.2027',
      '1.3.27',
      '01/03/2027',
      '1/3/27',
      '01-03-2027',
      '1-3-27'
    ])('godtar og normaliserer %s', (value) => {
      expect(schema.parse({ ...gyldigeVerdier, [felt]: value })[felt]).toBe(
        '01.03.2027'
      )
    })

    it.each([
      '32.01.2027',
      '31.02.2027',
      '29.02.2027',
      '32012027',
      '320127',
      '32.01.27',
      '00.01.2027',
      '01.13.2027'
    ])('gir datofeil for %s uten å normalisere til en annen dato', (value) => {
      const result = parseDato(value)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.map((issue) => issue.message)).toEqual([
          UGYLDIG_DATO
        ])
      }
    })

    it.each(['01_03_2027', '2027-03-01'])(
      'gir formatfeil for ukjent format %s',
      (value) => {
        const result = parseDato(value)

        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(UGYLDIG_DATO_FORMAT)
        }
      }
    )

    it('gir kun påkrevd-feil for tom verdi', () => {
      const result = parseDato('')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.map((issue) => issue.message)).toEqual([
          DATO_PAAKREVD_FEILMELDINGER[felt]
        ])
      }
    })

    it('godtar skuddårsdag', () => {
      const result = schema.parse({
        ...gyldigeVerdier,
        startdato: '29022028',
        sluttdato: '29022028'
      })
      expect(result[felt]).toBe('29.02.2028')
    })
  })

  it('sammenligner og normaliserer datoer med ulike formater', () => {
    const result = schema.parse({
      ...gyldigeVerdier,
      startdato: '010327',
      sluttdato: '31032027'
    })

    expect(result.startdato).toBe('01.03.2027')
    expect(result.sluttdato).toBe('31.03.2027')
  })

  it('godtar 1. januar 2000', () => {
    expect(
      schema.safeParse({
        ...gyldigeVerdier,
        startdato: '01.01.2000',
        sluttdato: '31.01.2000'
      }).success
    ).toBe(true)
  })

  it('avviser startdato før år 2000', () => {
    const result = schema.safeParse({
      ...gyldigeVerdier,
      startdato: '01.01.0200',
      sluttdato: '31.01.0200'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['startdato'],
            message: START_DATO_FOER_2000_FEILMELDING
          })
        ])
      )
    }
  })

  it('avviser startdato mer enn fem år frem i tid', () => {
    const dato = dayjs(MAX_START_DATO).add(1, 'day').format(DATE_FORMAT)
    const result = schema.safeParse({
      ...gyldigeVerdier,
      startdato: dato,
      sluttdato: dato
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['startdato'],
            message: START_DATO_ETTER_5_AAR_FEILMELDING
          })
        ])
      )
    }
  })

  it('viser periodefeil på startdato selv om sluttdato er ugyldig', () => {
    const result = schema.safeParse({
      ...gyldigeVerdier,
      startdato: '01.01.0200',
      sluttdato: '32.01.2027'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.map(({ path, message }) => ({ path, message }))
      ).toEqual([
        {
          path: ['sluttdato'],
          message: UGYLDIG_DATO
        },
        {
          path: ['startdato'],
          message: START_DATO_FOER_2000_FEILMELDING
        }
      ])
    }
  })

  it('gir bare rekkefølgefeil når sluttdato er før startdato', () => {
    const result = schema.safeParse({
      ...gyldigeVerdier,
      sluttdato: '28.02.2027'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map(({ message }) => message)).toEqual([
        SLUTTDATO_ETTER_STARTDATO_FEILMELDING
      ])
    }
  })

  it.each([
    ['010168', '01.01.2068'],
    ['010169', '01.01.1969']
  ])('tolker tosifret årstall i %s som %s', (value, forventet) => {
    expect(parsePameldingDato(value)?.format(DATE_FORMAT)).toBe(forventet)
  })
})
