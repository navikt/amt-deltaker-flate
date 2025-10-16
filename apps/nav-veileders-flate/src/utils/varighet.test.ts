import dayjs from 'dayjs'
import {
  DeltakerlisteStatus,
  DeltakerStatusType,
  ArenaTiltakskode,
  Oppstartstype
} from 'deltaker-flate-common'
import { v4 as uuidv4 } from 'uuid'
import { describe, expect, it } from 'vitest'
import { PameldingResponse } from '../api/data/pamelding.ts'
import {
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  finnVarighetValg,
  getMaxVarighetDato,
  getSisteGyldigeSluttDato,
  getSkalBekrefteVarighet,
  getSluttDatoFeilmelding,
  getVarighet,
  kalkulerSluttdato,
  SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING,
  VARGIHET_VALG_FEILMELDING,
  VarighetValg
} from './varighet.tsx'

const startdato = dayjs().subtract(1, 'year') // '2023-10-28'
const sluttdato = dayjs().add(1, 'year')

const pamelding: PameldingResponse = {
  deltakerId: uuidv4(),
  fornavn: 'Navn',
  mellomnavn: null,
  etternavn: 'Naversen',
  deltakerliste: {
    deltakerlisteId: uuidv4(),
    deltakerlisteNavn: 'Testliste',
    tiltakstype: ArenaTiltakskode.ARBFORB,
    arrangorNavn: 'Den Beste Arrangøren AS',
    oppstartstype: Oppstartstype.LOPENDE,
    startdato: startdato.toDate(),
    sluttdato: sluttdato.toDate(),
    status: DeltakerlisteStatus.GJENNOMFORES,
    tilgjengeligInnhold: {
      innhold: [],
      ledetekst: ''
    },
    erEnkeltplassUtenRammeavtale: false
  },
  status: {
    id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
    type: DeltakerStatusType.DELTAR,
    aarsak: null,
    gyldigFra: dayjs().subtract(17, 'day').toDate(),
    gyldigTil: null,
    opprettet: dayjs().subtract(1, 'day').toDate()
  },
  startdato: startdato.format('YYYY-MM-DD'),
  sluttdato: null,
  dagerPerUke: null,
  deltakelsesprosent: 100,
  bakgrunnsinformasjon: 'Bakgrunnsinformasjon',
  deltakelsesinnhold: null,
  vedtaksinformasjon: null,
  adresseDelesMedArrangor: true,
  kanEndres: true,
  digitalBruker: true,
  maxVarighet: dayjs.duration(2, 'month').asMilliseconds(),
  softMaxVarighet: dayjs.duration(1, 'month').asMilliseconds(),
  forslag: [],
  importertFraArena: null,
  harAdresse: false,
  deltakelsesmengder: {
    sisteDeltakelsesmengde: null,
    nesteDeltakelsesmengde: null
  },
  erUnderOppfolging: true,
  erManueltDeltMedArrangor: true
}

describe('kalkulerSluttdato', () => {
  const gyldigDato = new Date(2024, 0, 20)
  const forventetDato = new Date(2024, 1, 17)

  it('Returnerer riktig sluttdato for gyldig dato og varighet', () =>
    expect(
      kalkulerSluttdato(gyldigDato, getVarighet(VarighetValg.FIRE_UKER))
    ).toStrictEqual(forventetDato))
})

describe('getMaxVarighetDato', () => {
  it('returns null når ingen max varighet', () => {
    const maxVarighetDato = getMaxVarighetDato({
      ...pamelding,
      maxVarighet: null
    })
    expect(maxVarighetDato).toEqual(null)
  })

  it('returns null når ingen startdato', () => {
    const maxVarighetDato = getMaxVarighetDato({
      ...pamelding,
      startdato: null,
      maxVarighet: dayjs.duration(1, 'month').asMilliseconds()
    })
    expect(maxVarighetDato).toEqual(null)
  })

  it('returns varighet beregnet fra deltakers startdato', () => {
    const maxVarighetDato = getMaxVarighetDato({
      ...pamelding,
      startdato: '2024-01-20',
      maxVarighet: dayjs.duration(1, 'month').asMilliseconds()
    })
    expect(
      dayjs(maxVarighetDato).isSame(dayjs('2024-02-19'), 'day')
    ).toBeTruthy()
  })

  it('returns varighet beregnet fra ny startdato', () => {
    const maxVarighetDato = getMaxVarighetDato(
      {
        ...pamelding,
        startdato: '2024-01-20',
        maxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs('2024-02-20').toDate()
    )
    expect(
      dayjs(maxVarighetDato).isSame(dayjs('2024-03-21'), 'day')
    ).toBeTruthy()
  })
})

describe('getSisteGyldigeSluttDato', () => {
  it('returnerer deltakerlistens sluttdato når ingen maxVarighetDato', () => {
    const deltakerlisteSluttDato = dayjs('2025-01-20')
    const dato = getSisteGyldigeSluttDato({
      ...pamelding,
      deltakerliste: {
        ...pamelding.deltakerliste,
        sluttdato: deltakerlisteSluttDato.toDate()
      },
      maxVarighet: null
    })
    expect(dayjs(dato).isSame(deltakerlisteSluttDato, 'day')).toBeTruthy()
  })
  it('returnerer maxVarighetDato når ingen deltakerlistens sluttdato', () => {
    const dato = getSisteGyldigeSluttDato(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: null
        },
        maxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs('2025-03-20').toDate()
    )
    expect(dayjs(dato).isSame(dayjs('2025-04-19'), 'day')).toBeTruthy()
  })
  it('returnerer deltakerlistens sluttdato når den er før maxVarighetDato', () => {
    const deltakerlisteSluttDato = dayjs('2025-03-20')
    const dato = getSisteGyldigeSluttDato(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: deltakerlisteSluttDato.toDate()
        },
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds()
      },
      dayjs('2025-02-20').toDate()
    )
    expect(dayjs(dato).isSame(deltakerlisteSluttDato, 'day')).toBeTruthy()
  })
  it('returnerer maxVarighetDato når den er før deltakerlistens sluttdato', () => {
    const deltakerlisteSluttDato = dayjs('2025-03-20')
    const dato = getSisteGyldigeSluttDato(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: deltakerlisteSluttDato.toDate()
        },
        maxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs('2024-03-20').toDate()
    )
    expect(dayjs(dato).isSame(dayjs('2024-04-19'), 'day')).toBeTruthy()
  })
})

describe('getSkalBekrefteVarighet', () => {
  it('returnerer false for tiltak som ikke er ARBFORB eller INDOPPFAG', () => {
    const skalBekrefte = getSkalBekrefteVarighet(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          tiltakstype: ArenaTiltakskode.VASV
        }
      },
      dayjs('2024-03-20').toDate()
    )
    expect(skalBekrefte).toEqual(false)
  })
  it('returnerer true for tiltak som er ARBFORB eller INDOPPFAG og for sluttdato etter soft varighet', () => {
    const skalBekrefte = getSkalBekrefteVarighet(
      {
        ...pamelding,
        startdato: '2024-03-20',
        sluttdato: '2025-10-28',
        deltakerliste: {
          ...pamelding.deltakerliste,
          tiltakstype: ArenaTiltakskode.ARBFORB
        },
        maxVarighet: null,
        softMaxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs('2024-07-23').toDate()
    )
    expect(skalBekrefte).toEqual(true)
  })

  it('returnerer false for sluttdato over max varighet', () => {
    const skalBekrefte = getSkalBekrefteVarighet(
      {
        ...pamelding,
        startdato: '2024-03-20',
        sluttdato: '2024-04-28',
        deltakerliste: {
          ...pamelding.deltakerliste,
          tiltakstype: ArenaTiltakskode.ARBFORB
        },
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds(),
        softMaxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs('2024-07-23').toDate()
    )
    expect(skalBekrefte).toEqual(false)
  })

  it('returnerer false for sluttdato over max varighet, med ny startDato', () => {
    const skalBekrefte = getSkalBekrefteVarighet(
      {
        ...pamelding,
        startdato: '2024-01-20',
        sluttdato: '2024-02-28',
        deltakerliste: {
          ...pamelding.deltakerliste,
          tiltakstype: ArenaTiltakskode.ARBFORB
        },
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds(),
        softMaxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs('2024-07-23').toDate(),
      dayjs('2024-05-23').toDate()
    )
    expect(skalBekrefte).toEqual(false)
  })
  it('returnerer true for tiltak som er ARBFORB eller INDOPPFAG og for sluttdato etter soft varighet, med ny startDato', () => {
    const skalBekrefte = getSkalBekrefteVarighet(
      {
        ...pamelding,
        startdato: '2024-01-20',
        sluttdato: '2025-10-28',
        deltakerliste: {
          ...pamelding.deltakerliste,
          tiltakstype: ArenaTiltakskode.ARBFORB
        },
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds(),
        softMaxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs('2024-06-23').toDate(),
      dayjs('2024-05-20').toDate()
    )
    expect(skalBekrefte).toEqual(true)
  })
  it('returnerer false når ingen soft varighet,', () => {
    const skalBekrefte = getSkalBekrefteVarighet(
      {
        ...pamelding,
        startdato: '2024-03-20',
        sluttdato: '2025-10-28',
        deltakerliste: {
          ...pamelding.deltakerliste,
          tiltakstype: ArenaTiltakskode.ARBFORB
        },
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds(),
        softMaxVarighet: null
      },
      dayjs('2024-04-23').toDate()
    )
    expect(skalBekrefte).toEqual(false)
  })
})

describe('getSluttDatoFeilmelding', () => {
  it('returnerer feilmelding for ny sluttdato før startdato feil', () => {
    const feilmelding = getSluttDatoFeilmelding(
      { ...pamelding, startdato: dayjs().subtract(5, 'day').toString() },
      dayjs().subtract(20, 'day').toDate()
    )
    expect(feilmelding).toEqual(SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING)
  })

  it('returnerer feilmelding for ny sluttdato før ny startdato feil', () => {
    const feilmelding = getSluttDatoFeilmelding(
      { ...pamelding, startdato: dayjs().subtract(5, 'day').toString() },
      dayjs().subtract(20, 'day').toDate(),
      dayjs().subtract(9, 'day').toDate()
    )
    expect(feilmelding).toEqual(SLUTTDATO_FØR_OPPSTARTSDATO_FEILMELDING)
  })

  it('returnerer ingen feilmelding når vi ikke har maks varighet eller sluttdato for tiltaket', () => {
    const feilmelding = getSluttDatoFeilmelding(
      {
        ...pamelding,
        deltakerliste: { ...pamelding.deltakerliste, sluttdato: null },
        maxVarighet: null
      },
      dayjs().add(3, 'month').toDate(),
      dayjs().subtract(9, 'day').toDate()
    )
    expect(feilmelding).toEqual(null)
  })

  it('returnerer feilmelding for ny sluttdato etter max varighet', () => {
    const feilmelding = getSluttDatoFeilmelding(
      {
        ...pamelding,
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds()
      },
      dayjs().add(3, 'month').toDate(),
      dayjs().subtract(9, 'day').toDate()
    )
    expect(feilmelding).toEqual(VARGIHET_VALG_FEILMELDING)
  })

  it('returnerer feilmelding for ny sluttdato utenfor tiltakets periode', () => {
    const feilmelding = getSluttDatoFeilmelding(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: dayjs().add(2, 'month').toDate()
        },
        maxVarighet: null
      },
      dayjs().add(3, 'month').toDate()
    )
    expect(feilmelding).toEqual(DATO_UTENFOR_TILTAKGJENNOMFORING)
  })

  it('returnerer ingen feilmelding for ny sluttdato når den er innenfor max varighet og tiltakets periode', () => {
    const feilmelding = getSluttDatoFeilmelding(
      {
        ...pamelding,
        startdato: '2024-04-23',
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: dayjs('2024-10-23').toDate()
        },
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds()
      },
      dayjs('2024-05-23').toDate()
    )
    expect(feilmelding).toEqual(null)
  })

  it('returnerer feilmelding for ny sluttdato etter max varighet, og maks varighet er før tiltaktes sluttdato', () => {
    const feilmelding = getSluttDatoFeilmelding(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: dayjs().add(3, 'month').toDate()
        },
        maxVarighet: dayjs.duration(1, 'month').asMilliseconds()
      },
      dayjs().add(2, 'month').toDate()
    )
    expect(feilmelding).toEqual(VARGIHET_VALG_FEILMELDING)
  })

  it('returnerer feilmelding for ny sluttdato utenfor tiltakets periode, og maks varighet er før tiltaktes sluttdato', () => {
    const feilmelding = getSluttDatoFeilmelding(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: dayjs().add(3, 'month').toDate()
        },
        maxVarighet: dayjs.duration(2, 'month').asMilliseconds()
      },
      dayjs().add(4, 'month').toDate()
    )
    expect(feilmelding).toEqual(DATO_UTENFOR_TILTAKGJENNOMFORING)
  })

  it('returnerer feilmelding for ny sluttdato utenfor tiltakets periode, og maks varighet er etter tiltaktes sluttdato', () => {
    const feilmelding = getSluttDatoFeilmelding(
      {
        ...pamelding,
        deltakerliste: {
          ...pamelding.deltakerliste,
          sluttdato: dayjs().add(2, 'month').toDate()
        },
        maxVarighet: dayjs.duration(3, 'month').asMilliseconds()
      },
      dayjs().add(4, 'month').toDate()
    )
    expect(feilmelding).toEqual(DATO_UTENFOR_TILTAKGJENNOMFORING)
  })
})

describe('finnVarighet', () => {
  it('tildato er en uke-varighet etter fradato finner riktig varighet', () => {
    const fra = dayjs()
    const til = fra.add(4, 'weeks')

    const varighet = finnVarighetValg(fra.toDate(), til.toDate())

    expect(varighet.uker).toBe(VarighetValg.FIRE_UKER)
    expect(varighet.maaneder).toBe(VarighetValg.ANNET)
  })
  it('tildato er en mnd-varighet etter fradato finner riktig varighet', () => {
    const fra = dayjs()
    const til = fra.add(12, 'months')

    const varighet = finnVarighetValg(fra.toDate(), til.toDate())

    expect(varighet.uker).toBe(VarighetValg.ANNET)
    expect(varighet.maaneder).toBe(VarighetValg.TOLV_MANEDER)
  })
  it('tildato er ikke en varighet etter fradato finner ANNET', () => {
    const fra = dayjs()
    const til = fra.add(4, 'weeks').add(1, 'day')

    const varighet = finnVarighetValg(fra.toDate(), til.toDate())

    expect(varighet.uker).toBe(VarighetValg.ANNET)
    expect(varighet.maaneder).toBe(VarighetValg.ANNET)
  })
  it('tildato er ikke en varighet etter fradato finner ANNET', () => {
    const fra = dayjs()
    const til = fra.add(3, 'months').add(1, 'weeks')

    const varighet = finnVarighetValg(fra.toDate(), til.toDate())

    expect(varighet.uker).toBe(VarighetValg.ANNET)
    expect(varighet.maaneder).toBe(VarighetValg.ANNET)
  })
})
