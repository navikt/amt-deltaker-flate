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
    const iGaar = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1
    )
    const iMorgen = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )

    it('returnerer true når ingen mengde er aktiv i dag', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iMorgen)]),
        new Date(),
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

    it('returnerer true når ny gyldigFra er før den aktive mengdens startdato', () => {
      const aktiv = lagMengde(iGaar)
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([aktiv]),
        dayjs(iGaar).subtract(1, 'day').toDate(),
        () => false
      )

      expect(harEndring).toBe(true)
    })

    it('ignorerer framtidige mengder når den sammenligner med aktiv mengde', () => {
      const harEndring = harEndringSidenSisteDeltakelsesmengde(
        lagDeltaker([lagMengde(iGaar), lagMengde(iMorgen)]),
        new Date(),
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
