import { describe, expect, it } from 'vitest'
import { lagDeltaker } from '../../components/test-utils/deltaker-context-test-utils'
import { deltakerSchema } from './deltaker'

describe('deltakerSchema', () => {
  it('parser gyldige deltakelsesmengder og datoer', () => {
    const response = deltakerSchema.parse({
      ...lagDeltaker(),
      gyldigeDeltakelsesmengder: [
        {
          deltakelsesprosent: 60,
          dagerPerUke: 3,
          gyldigFra: '2026-10-12'
        }
      ]
    })

    expect(response.gyldigeDeltakelsesmengder).toEqual([
      {
        deltakelsesprosent: 60,
        dagerPerUke: 3,
        gyldigFra: new Date(2026, 9, 12)
      }
    ])
  })

  it('bruker tom liste når responsen mangler feltet', () => {
    const responseUtenListe = { ...lagDeltaker() }
    Reflect.deleteProperty(responseUtenListe, 'gyldigeDeltakelsesmengder')

    expect(
      deltakerSchema.parse(responseUtenListe).gyldigeDeltakelsesmengder
    ).toEqual([])
  })
})
