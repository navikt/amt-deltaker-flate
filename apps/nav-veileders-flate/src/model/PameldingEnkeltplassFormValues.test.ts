import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getMockDeltaker } from '../mocks/mockDeltakere'
import { MAX_START_DATO } from '../utils/varighet'
import {
  createPameldingEnkeltplassFormSchema,
  DATE_FORMAT,
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
      '2027-03-01'
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
          'Datoen finnes ikke. Kontroller dag, måned og år.'
        ])
      }
    })

    it('gir formatfeil for ukjent format', () => {
      const result = parseDato('01/03/2027')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Ugyldig datoformat: Bruk dd.mm.åååå'
        )
      }
    })

    it('gir kun påkrevd-feil for tom verdi', () => {
      const result = parseDato('')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.map((issue) => issue.message)).toEqual([
          `${felt === 'startdato' ? 'Startdato' : 'Sluttdato'} er påkrevd.`
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
            message: 'Startdato kan ikke være før år 2000.'
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
            message: 'Startdato kan ikke være lenger enn 5 år frem i tid.'
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
          message: 'Datoen finnes ikke. Kontroller dag, måned og år.'
        },
        {
          path: ['startdato'],
          message: 'Startdato kan ikke være før år 2000.'
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
        'Sluttdato må være etter startdato.'
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
