import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import { DeltakerStatusType, EndreDeltakelseType } from 'deltaker-flate-common'
import {
  erLaastMenNyligAvsluttet,
  getEndreDeltakelsesValg,
  validerDeltakerKanEndres
} from './endreDeltakelse.ts'
const lagDeltaker = (overrides: Partial<DeltakerResponse>): DeltakerResponse =>
  ({
    deltakerId: 'test-id',
    fornavn: 'Test',
    mellomnavn: null,
    etternavn: 'Testesen',
    deltakerliste: {
      deltakerlisteId: 'liste-id',
      deltakerlisteNavn: 'Testtiltak',
      tiltakskode: 'ARBEIDSTRENING',
      arrangorNavn: 'Arrangøren',
      arrangor: null,
      oppstartstype: 'LOPENDE',
      startdato: null,
      sluttdato: null,
      status: 'GJENNOMFORES',
      tilgjengeligInnhold: { ledetekst: null, innhold: [] },
      erEnkeltplass: false,
      oppmoteSted: null,
      pameldingstype: 'PAMELDING',
      kodeverk: null
    },
    status: {
      id: 'status-id',
      type: DeltakerStatusType.DELTAR,
      aarsak: null,
      gyldigFra: dayjs().subtract(1, 'month').toDate(),
      gyldigTil: null,
      opprettet: dayjs().subtract(1, 'month').toDate()
    },
    startdato: null,
    sluttdato: null,
    dagerPerUke: null,
    deltakelsesprosent: null,
    bakgrunnsinformasjon: null,
    deltakelsesinnhold: null,
    vedtaksinformasjon: null,
    adresseDelesMedArrangor: false,
    kanEndres: true,
    digitalBruker: true,
    harAdresse: true,
    maxVarighet: null,
    softMaxVarighet: null,
    forslag: [],
    importertFraArena: null,
    erUnderOppfolging: true,
    deltakelsesmengder: {
      sisteDeltakelsesmengde: null,
      nesteDeltakelsesmengde: null
    },
    erManueltDeltMedArrangor: false,
    prisinformasjon: null,
    ...overrides
  }) as DeltakerResponse
const lagAvsluttetDeltaker = (
  statusType: DeltakerStatusType,
  kanEndres: boolean,
  sluttdatoOffset: { amount: number; unit: dayjs.ManipulateType }
): DeltakerResponse => {
  const sluttdato = dayjs()
    .subtract(sluttdatoOffset.amount, sluttdatoOffset.unit)
    .toDate()
  return lagDeltaker({
    kanEndres,
    sluttdato,
    status: {
      id: 'status-id',
      type: statusType,
      aarsak: null,
      gyldigFra: sluttdato,
      gyldigTil: null,
      opprettet: sluttdato
    }
  })
}
describe('erLaastMenNyligAvsluttet', () => {
  it('returnerer false når kanEndres=true', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.HAR_SLUTTET, true, {
      amount: 1,
      unit: 'month'
    })
    expect(erLaastMenNyligAvsluttet(d)).toBe(false)
  })
  it('returnerer true for låst HAR_SLUTTET avsluttet for 1 mnd siden', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.HAR_SLUTTET, false, {
      amount: 1,
      unit: 'month'
    })
    expect(erLaastMenNyligAvsluttet(d)).toBe(true)
  })
  it('returnerer true for låst FULLFORT avsluttet for 3 uker siden', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.FULLFORT, false, {
      amount: 3,
      unit: 'week'
    })
    expect(erLaastMenNyligAvsluttet(d)).toBe(true)
  })
  it('returnerer true for låst AVBRUTT avsluttet for 1 uke siden', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.AVBRUTT, false, {
      amount: 1,
      unit: 'week'
    })
    expect(erLaastMenNyligAvsluttet(d)).toBe(true)
  })
  it('returnerer false for låst IKKE_AKTUELL (ikke omfattet av unntaket)', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.IKKE_AKTUELL, false, {
      amount: 6,
      unit: 'week'
    })
    expect(erLaastMenNyligAvsluttet(d)).toBe(false)
  })
  it('returnerer false for låst HAR_SLUTTET avsluttet for mer enn 2 måneder siden', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.HAR_SLUTTET, false, {
      amount: 3,
      unit: 'month'
    })
    expect(erLaastMenNyligAvsluttet(d)).toBe(false)
  })
  it('returnerer false for låst DELTAR (ikke avsluttende status)', () => {
    const d = lagDeltaker({ kanEndres: false })
    expect(erLaastMenNyligAvsluttet(d)).toBe(false)
  })
  it('returnerer false for låst FEILREGISTRERT', () => {
    const d = lagDeltaker({
      kanEndres: false,
      status: {
        id: 'status-id',
        type: DeltakerStatusType.FEILREGISTRERT,
        aarsak: null,
        gyldigFra: dayjs().subtract(1, 'week').toDate(),
        gyldigTil: null,
        opprettet: dayjs().subtract(1, 'week').toDate()
      }
    })
    expect(erLaastMenNyligAvsluttet(d)).toBe(false)
  })
})
describe('getEndreDeltakelsesValg - låst men nylig avsluttet', () => {
  it('HAR_SLUTTET låst innen 2 mnd: viser kun ENDRE_AVSLUTNING', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.HAR_SLUTTET, false, {
      amount: 1,
      unit: 'month'
    })
    const valg = getEndreDeltakelsesValg(d)
    expect(valg).toContain(EndreDeltakelseType.ENDRE_AVSLUTNING)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_SLUTTARSAK)
    expect(valg).not.toContain(EndreDeltakelseType.FORLENG_DELTAKELSE)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_OPPSTARTSDATO)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_INNHOLD)
    expect(valg).not.toContain(EndreDeltakelseType.REAKTIVER_DELTAKELSE)
    expect(valg.length).toBe(1)
  })
  it('FULLFORT låst innen 2 mnd: viser kun ENDRE_AVSLUTNING', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.FULLFORT, false, {
      amount: 3,
      unit: 'week'
    })
    const valg = getEndreDeltakelsesValg(d)
    expect(valg).toContain(EndreDeltakelseType.ENDRE_AVSLUTNING)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_SLUTTARSAK)
    expect(valg.length).toBe(1)
  })
  it('AVBRUTT låst innen 2 mnd: viser kun ENDRE_AVSLUTNING', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.AVBRUTT, false, {
      amount: 2,
      unit: 'week'
    })
    const valg = getEndreDeltakelsesValg(d)
    expect(valg).toContain(EndreDeltakelseType.ENDRE_AVSLUTNING)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_SLUTTARSAK)
    expect(valg.length).toBe(1)
  })
  it('IKKE_AKTUELL låst innen 2 mnd: ingen valg (ikke omfattet av unntaket)', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.IKKE_AKTUELL, false, {
      amount: 6,
      unit: 'week'
    })
    const valg = getEndreDeltakelsesValg(d)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_AVSLUTNING)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_SLUTTARSAK)
    expect(valg.length).toBe(0)
  })
  it('HAR_SLUTTET låst eldre enn 2 mnd: ingen valg', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.HAR_SLUTTET, false, {
      amount: 3,
      unit: 'month'
    })
    const valg = getEndreDeltakelsesValg(d)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_AVSLUTNING)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_SLUTTARSAK)
  })
})
describe('validerDeltakerKanEndres - låst men nylig avsluttet', () => {
  it('kaster ikke feil for låst HAR_SLUTTET avsluttet for 1 mnd siden', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.HAR_SLUTTET, false, {
      amount: 1,
      unit: 'month'
    })
    expect(() => validerDeltakerKanEndres(d)).not.toThrow()
  })
  it('kaster feil for låst HAR_SLUTTET avsluttet for mer enn 2 måneder siden', () => {
    const d = lagAvsluttetDeltaker(DeltakerStatusType.HAR_SLUTTET, false, {
      amount: 3,
      unit: 'month'
    })
    expect(() => validerDeltakerKanEndres(d)).toThrow()
  })
  it('kaster feil for FEILREGISTRERT', () => {
    const d = lagDeltaker({
      kanEndres: false,
      status: {
        id: 'status-id',
        type: DeltakerStatusType.FEILREGISTRERT,
        aarsak: null,
        gyldigFra: dayjs().subtract(1, 'week').toDate(),
        gyldigTil: null,
        opprettet: dayjs().subtract(1, 'week').toDate()
      }
    })
    expect(() => validerDeltakerKanEndres(d)).toThrow(
      'Deltakeren er feilregistrert'
    )
  })
  it('kaster ikke feil for en vanlig (ikke låst) DELTAR deltaker', () => {
    const d = lagDeltaker({ kanEndres: true })
    expect(() => validerDeltakerKanEndres(d)).not.toThrow()
  })
})

describe('getEndreDeltakelsesValg - visning av ENDRE_PRISINFO', () => {
  it('viser ENDRE_PRISINFO for enkeltplass med status SOKT_INN', () => {
    const d = lagDeltaker({
      deltakerliste: {
        ...lagDeltaker({}).deltakerliste,
        erEnkeltplass: true
      },
      status: {
        ...lagDeltaker({}).status,
        type: DeltakerStatusType.SOKT_INN
      }
    })

    const valg = getEndreDeltakelsesValg(d)
    expect(valg).toContain(EndreDeltakelseType.ENDRE_PRISINFO)
  })

  it('viser ikke ENDRE_PRISINFO for ikke-enkeltplass', () => {
    const d = lagDeltaker({
      deltakerliste: {
        ...lagDeltaker({}).deltakerliste,
        erEnkeltplass: false
      },
      status: {
        ...lagDeltaker({}).status,
        type: DeltakerStatusType.DELTAR
      }
    })

    const valg = getEndreDeltakelsesValg(d)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_PRISINFO)
  })

  it('viser ikke ENDRE_PRISINFO for enkeltplass med status VENTELISTE (skal ikke gå an)', () => {
    const d = lagDeltaker({
      deltakerliste: {
        ...lagDeltaker({}).deltakerliste,
        erEnkeltplass: true
      },
      status: {
        ...lagDeltaker({}).status,
        type: DeltakerStatusType.VENTELISTE
      }
    })

    const valg = getEndreDeltakelsesValg(d)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_PRISINFO)
  })

  it('viser ikke ENDRE_PRISINFO når deltakelsen er låst', () => {
    const d = lagDeltaker({
      kanEndres: false,
      deltakerliste: {
        ...lagDeltaker({}).deltakerliste,
        erEnkeltplass: true
      },
      status: {
        ...lagDeltaker({}).status,
        type: DeltakerStatusType.DELTAR
      }
    })

    const valg = getEndreDeltakelsesValg(d)
    expect(valg).not.toContain(EndreDeltakelseType.ENDRE_PRISINFO)
  })
})
