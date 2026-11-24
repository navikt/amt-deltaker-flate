import { describe, expect, it } from 'vitest'
import { deltakerSchema } from './deltaker'

describe('deltakerSchema - deltakelsesmengder', () => {
  const schema = deltakerSchema.pick({ deltakelsesmengder: true })
  const periode = {
    deltakelsesprosent: null,
    dagerPerUke: 3,
    gyldigFra: '2026-12-01'
  }

  it('godtar null når deltakeren ikke har en mengdetidslinje', () => {
    expect(schema.parse({ deltakelsesmengder: null })).toEqual({
      deltakelsesmengder: null
    })
  })

  it('bevarer en periode med dager uten prosent og konverterer datoen', () => {
    expect(
      schema.parse({
        deltakelsesmengder: {
          nesteDeltakelsesmengde: periode,
          sisteDeltakelsesmengde: periode
        }
      })
    ).toEqual({
      deltakelsesmengder: {
        nesteDeltakelsesmengde: {
          ...periode,
          gyldigFra: new Date('2026-12-01T00:00:00')
        },
        sisteDeltakelsesmengde: {
          ...periode,
          gyldigFra: new Date('2026-12-01T00:00:00')
        }
      }
    })
  })

  it('godtar en eksplisitt tom periode', () => {
    const tomPeriode = { ...periode, dagerPerUke: null }
    const result = schema.parse({
      deltakelsesmengder: {
        nesteDeltakelsesmengde: null,
        sisteDeltakelsesmengde: tomPeriode
      }
    })

    expect(result.deltakelsesmengder?.sisteDeltakelsesmengde).toMatchObject({
      deltakelsesprosent: null,
      dagerPerUke: null
    })
  })

  it.each([null, undefined])(
    'avviser siste periode med verdien %s når containeren finnes',
    (sisteDeltakelsesmengde) => {
      expect(
        schema.safeParse({
          deltakelsesmengder: {
            nesteDeltakelsesmengde: null,
            sisteDeltakelsesmengde
          }
        }).success
      ).toBe(false)
    }
  )

  it('godtar ikke at containerfeltet mangler', () => {
    expect(schema.safeParse({}).success).toBe(false)
  })
})
