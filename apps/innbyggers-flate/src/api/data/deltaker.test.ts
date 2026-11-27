import { describe, expect, it } from 'vitest'
import { deltakerSchema } from './deltaker'

describe('deltakerSchema - deltakelsesmengder', () => {
  const schema = deltakerSchema.pick({ deltakelsesmengder: true })

  it('godtar null når deltakeren ikke har en mengdetidslinje', () => {
    expect(schema.parse({ deltakelsesmengder: null })).toEqual({
      deltakelsesmengder: null
    })
  })

  it.each([3, null])(
    'bevarer manglende prosent med %s dager i siste og neste periode',
    (dagerPerUke) => {
      const periode = {
        deltakelsesprosent: null,
        dagerPerUke,
        gyldigFra: '2026-12-01'
      }
      const result = schema.parse({
        deltakelsesmengder: {
          nesteDeltakelsesmengde: periode,
          sisteDeltakelsesmengde: periode
        }
      })

      expect(result.deltakelsesmengder).toEqual({
        nesteDeltakelsesmengde: {
          ...periode,
          gyldigFra: new Date('2026-12-01T00:00:00')
        },
        sisteDeltakelsesmengde: {
          ...periode,
          gyldigFra: new Date('2026-12-01T00:00:00')
        }
      })
    }
  )

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
})
