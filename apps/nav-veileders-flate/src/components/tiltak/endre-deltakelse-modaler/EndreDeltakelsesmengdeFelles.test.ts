import { DeltakerStatusType } from 'deltaker-flate-common'
import { describe, expect, it } from 'vitest'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import {
  harEndringSidenSisteDeltakelsesmengde,
  lagFellesDeltakelsesmengdeBodyFelter
} from './EndreDeltakelsesmengdeFelles.ts'

type SisteDeltakelsesmengde =
  DeltakerResponse['deltakelsesmengder']['sisteDeltakelsesmengde']

const lagDeltaker = (
  sisteDeltakelsesmengde: SisteDeltakelsesmengde
): DeltakerResponse =>
  ({
    deltakerId: 'deltaker-1',
    status: {
      id: 'status-1',
      type: DeltakerStatusType.DELTAR,
      aarsak: null,
      gyldigFra: new Date('2026-01-01'),
      gyldigTil: null,
      opprettet: new Date('2026-01-01')
    },
    kanEndres: true,
    deltakelsesmengder: {
      sisteDeltakelsesmengde,
      nesteDeltakelsesmengde: null
    }
  }) as unknown as DeltakerResponse

describe('EndreDeltakelsesmengdeFelles', () => {
  describe('harEndringSidenSisteDeltakelsesmengde', () => {
    it('returnerer true når siste deltakelsesmengde mangler', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker(null),
        new Date('2026-02-01'),
        () => false
      )

      expect(harEndring).toBe(true)
    })

    it('returnerer true når mengde er endret', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker({
          deltakelsesprosent: 60,
          dagerPerUke: 3,
          gyldigFra: new Date('2026-02-10')
        } as SisteDeltakelsesmengde),
        new Date('2026-02-10'),
        () => true
      )

      expect(harEndring).toBe(true)
    })

    it('returnerer true når gyldigFra er tidligere enn siste gyldigFra', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker({
          deltakelsesprosent: 60,
          dagerPerUke: 3,
          gyldigFra: new Date('2026-02-10')
        } as SisteDeltakelsesmengde),
        new Date('2026-02-01'),
        () => false
      )

      expect(harEndring).toBe(true)
    })

    it('returnerer false når mengde er lik og gyldigFra ikke er tidligere', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker({
          deltakelsesprosent: 60,
          dagerPerUke: 3,
          gyldigFra: new Date('2026-02-10')
        } as SisteDeltakelsesmengde),
        new Date('2026-02-10'),
        () => false
      )

      expect(harEndring).toBe(false)
    })
  })

  it('lagFellesDeltakelsesmengdeBodyFelter setter forventede standardverdier', () => {
    expect(
      lagFellesDeltakelsesmengdeBodyFelter(
        new Date('2026-02-03'),
        undefined,
        undefined
      )
    ).toEqual({
      gyldigFra: '2026-02-03',
      begrunnelse: null,
      forslagId: null
    })
  })
})
