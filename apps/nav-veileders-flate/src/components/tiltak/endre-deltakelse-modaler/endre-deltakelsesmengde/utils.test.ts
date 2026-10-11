import dayjs from 'dayjs'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { describe, expect, it } from 'vitest'
import { DeltakerResponse } from '../../../../api/data/deltaker.ts'
import {
  getMengde,
  harEndringSidenSisteDeltakelsesmengde,
  hentAktivDeltakelsesmengde,
  lagFellesDeltakelsesmengdeBodyFelter
} from './utils.ts'

type Deltakelsesmengde = DeltakerResponse['gyldigeDeltakelsesmengder'][number]

const lagMengde = (
  gyldigFra: Date,
  deltakelsesprosent = 60,
  dagerPerUke: number | null = 3
): Deltakelsesmengde => ({
  deltakelsesprosent,
  dagerPerUke,
  gyldigFra
})

const lagDeltaker = (
  gyldigeDeltakelsesmengder: Deltakelsesmengde[] = []
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
    startdato: null,
    sluttdato: null,
    gyldigeDeltakelsesmengder
  }) as unknown as DeltakerResponse

describe('EndreDeltakelsesmengdeFelles', () => {
  describe('hentAktivDeltakelsesmengde', () => {
    it('velger mengden med seneste gyldigFra på eller før datoen', () => {
      const tidligere = lagMengde(new Date('2026-01-01'))
      const aktiv = lagMengde(new Date('2026-02-10'))
      const framtidig = lagMengde(new Date('2026-02-20'))
      const mengder = [framtidig, aktiv, tidligere]

      expect(
        hentAktivDeltakelsesmengde(mengder, new Date('2026-02-10'))
      ).toEqual(aktiv)
      expect(mengder).toEqual([framtidig, aktiv, tidligere])
    })

    it('returnerer null når alle mengdene starter etter datoen', () => {
      expect(
        hentAktivDeltakelsesmengde(
          [lagMengde(new Date('2026-02-20'))],
          new Date('2026-02-10')
        )
      ).toBeNull()
    })
  })

  describe('getMengde', () => {
    it('bruker mengden som er gyldig på modalens forhåndsvalgte dato', () => {
      const gyldigFra = dayjs().add(10, 'day').startOf('day').toDate()
      const mengde = lagMengde(gyldigFra, 70, 4)
      const deltaker = lagDeltaker([
        lagMengde(dayjs(gyldigFra).subtract(1, 'day').toDate()),
        mengde
      ])
      deltaker.startdato = gyldigFra
      deltaker.sluttdato = dayjs(gyldigFra).add(1, 'month').toDate()

      expect(getMengde(deltaker, null)).toEqual({
        deltakelsesprosent: 70,
        dagerPerUke: 4,
        gyldigFra
      })
    })

    it('bruker 100 prosent og ingen dager når listen ikke har en aktiv mengde', () => {
      expect(getMengde(lagDeltaker(), null)).toMatchObject({
        deltakelsesprosent: 100,
        dagerPerUke: null
      })
    })
  })

  describe('harEndringSidenSisteDeltakelsesmengde', () => {
    const iGaar = dayjs().subtract(1, 'day').startOf('day').toDate()
    const iMorgen = dayjs().add(1, 'day').startOf('day').toDate()

    it('returnerer true når valgt dato ikke har en aktiv mengde', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iMorgen)]),
        dayjs().toDate(),
        () => false
      )

      expect(harEndring).toBe(true)
    })

    it('returnerer true når mengden er endret', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iGaar)]),
        new Date(),
        () => true
      )

      expect(harEndring).toBe(true)
    })

    it('returnerer true når ny mengde legges til på en vilkårlig dato', () => {
      const datoMidtIPerioden = dayjs(iGaar).add(12, 'hour').toDate()
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iGaar, 60, 3), lagMengde(iMorgen, 60, 4)]),
        datoMidtIPerioden,
        (aktiv) => aktiv.dagerPerUke !== 4
      )

      expect(harEndring).toBe(true)
    })

    it('returnerer false når mengden allerede gjelder på valgt dato', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iGaar, 60, 3), lagMengde(iMorgen, 60, 4)]),
        iMorgen,
        (aktiv) => aktiv.dagerPerUke !== 4 || aktiv.deltakelsesprosent !== 60
      )

      expect(harEndring).toBe(false)
    })

    it('returnerer true når mengden på valgt dato endres', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iGaar, 60, 3), lagMengde(iMorgen, 60, 4)]),
        iMorgen,
        (aktiv) => aktiv.dagerPerUke !== 3
      )

      expect(harEndring).toBe(true)
    })

    it('tillater å endre en periode til samme mengde som en tidligere periode', () => {
      const gyldigeDeltakelsesmengder = [
        lagMengde(new Date(2026, 9, 1), 60, 3),
        lagMengde(new Date(2026, 9, 10), 60, 4),
        lagMengde(new Date(2026, 9, 12), 60, 3),
        lagMengde(new Date(2026, 9, 19), 60, 4)
      ]
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker(gyldigeDeltakelsesmengder),
        new Date(2026, 9, 10),
        (aktiv) => aktiv.dagerPerUke !== 3
      )

      expect(harEndring).toBe(true)
    })

    it('returnerer true når deltakelsesprosenten på valgt dato endres', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iGaar, 60, 3), lagMengde(iMorgen, 80, 4)]),
        iMorgen,
        (aktiv) => aktiv.deltakelsesprosent !== 60
      )

      expect(harEndring).toBe(true)
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
