import { describe, expect, it } from 'vitest'
import { deltakerSchema } from './deltaker'

describe('deltakerSchema', () => {
  it('parser gyldige deltakelsesmengder og datoer', () => {
    const response = deltakerSchema.shape.gyldigeDeltakelsesmengder.parse([
      {
        deltakelsesprosent: 60,
        dagerPerUke: 3,
        gyldigFra: '2026-10-12'
      }
    ])

    expect(response).toEqual([
      {
        deltakelsesprosent: 60,
        dagerPerUke: 3,
        gyldigFra: new Date(2026, 9, 12)
      }
    ])
  })

  it('parser deltakelsesmengde uten prosent', () => {
    const response = deltakerSchema.shape.gyldigeDeltakelsesmengder.parse([
      {
        deltakelsesprosent: null,
        dagerPerUke: 5,
        gyldigFra: '2026-10-12'
      }
    ])

    expect(response).toEqual([
      {
        deltakelsesprosent: null,
        dagerPerUke: 5,
        gyldigFra: new Date(2026, 9, 12)
      }
    ])
  })

  it('bruker tom liste når responsen mangler feltet', () => {
    const schema = deltakerSchema.pick({
      gyldigeDeltakelsesmengder: true
    })

    expect(schema.parse({})).toEqual({ gyldigeDeltakelsesmengder: [] })
  })
})
