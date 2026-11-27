import { Deltakelsesmengde } from 'deltaker-flate-common'
import { describe, expect, it } from 'vitest'
import { lagDeltaker as lagDeltakerResponse } from '../../../test-utils/deltaker-context-test-utils.tsx'
import {
  getMengde,
  harEndringSidenSisteDeltakelsesmengde,
  lagFellesDeltakelsesmengdeBodyFelter
} from './utils.ts'

const lagDeltaker = (sisteDeltakelsesmengde: Deltakelsesmengde | null) =>
  lagDeltakerResponse({
    deltakelsesmengder: sisteDeltakelsesmengde
      ? { sisteDeltakelsesmengde, nesteDeltakelsesmengde: null }
      : null
  })

describe('EndreDeltakelsesmengdeFelles', () => {
  describe('harEndringSidenSisteDeltakelsesmengde', () => {
    it('returnerer true når deltakelsesmengder er null', () => {
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
        }),
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
        }),
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
        }),
        new Date('2026-02-10'),
        () => false
      )

      expect(harEndring).toBe(false)
    })

    it('sammenligner en periode uten prosent uten å sette inn hundre prosent', () => {
      const deltaker = lagDeltaker({
        deltakelsesprosent: null,
        dagerPerUke: 3,
        gyldigFra: new Date('2026-02-10')
      })

      expect(
        harEndringSidenSisteDeltakelsesmengde(
          deltaker,
          new Date('2026-02-10'),
          (siste) =>
            siste.deltakelsesprosent !== null || siste.dagerPerUke !== 3
        )
      ).toBe(false)
      expect(
        harEndringSidenSisteDeltakelsesmengde(
          deltaker,
          new Date('2026-02-10'),
          (siste) => siste.deltakelsesprosent !== 100 || siste.dagerPerUke !== 3
        )
      ).toBe(true)
    })

    it('bruker siste periode også når den ligger frem i tid', () => {
      const deltaker = lagDeltaker({
        deltakelsesprosent: null,
        dagerPerUke: 3,
        gyldigFra: new Date('2099-02-10')
      })

      expect(
        harEndringSidenSisteDeltakelsesmengde(
          deltaker,
          new Date('2099-02-10'),
          (siste) => siste.dagerPerUke !== 3
        )
      ).toBe(false)
      expect(
        harEndringSidenSisteDeltakelsesmengde(
          deltaker,
          new Date('2099-02-01'),
          (siste) => siste.dagerPerUke !== 3
        )
      ).toBe(true)
    })

    it('avviser uendret tom mengde uten å miste sammenligningsgrunnlaget', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker({
          deltakelsesprosent: null,
          dagerPerUke: null,
          gyldigFra: new Date('2026-02-10')
        }),
        new Date('2026-02-10'),
        (siste) => siste.dagerPerUke !== null
      )

      expect(harEndring).toBe(false)
    })
  })

  it('getMengde bevarer manglende prosent ved forhåndsutfylling', () => {
    const deltaker = lagDeltakerResponse({
      deltakelsesprosent: null,
      dagerPerUke: 3,
      deltakelsesmengder: null
    })

    expect(getMengde(deltaker, null)).toMatchObject({
      deltakelsesprosent: null,
      dagerPerUke: 3
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
