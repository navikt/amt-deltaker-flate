import { faker } from '@faker-js/faker/locale/nb_NO'
import dayjs from 'dayjs'
import {
  createMockAktivtForslag,
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  ForslagEndringAarsakType,
  ForslagEndringType,
  Oppstartstype,
  Tiltakskode,
  UlestHendelseType,
  Vurderingstype
} from 'deltaker-flate-common'
import { v4 as uuidv4 } from 'uuid'
import {
  DeltakerDetaljer,
  InnsatsbehovType,
  Vurdering
} from '../api/data/deltaker.ts'
import {
  Beskyttelsesmarkering,
  Deltaker,
  DeltakerlisteDetaljer
} from '../api/data/deltakerliste'
import { erAdresseBeskyttet } from '../utils/utils.ts'
import { UlestHendelse } from '../api/data/ulestHendelse.ts'

export type MockDeltaker = DeltakerDetaljer & Omit<Deltaker, 'vurdering'>

export const mapMockDeltakereToDeltakere = (
  mockDeltakere: MockDeltaker[]
): Deltaker[] => {
  return mockDeltakere.map(mapMockDeltakerToDeltaker)
}

export const mapMockDeltakerToDeltaker = (
  mockDeltaker: MockDeltaker
): Deltaker => {
  return {
    ...mockDeltaker,
    vurdering: mockDeltaker.vurdering?.type ?? null
  } as Deltaker
}

export const createMockDeltaker = (
  id: string,
  statusType: DeltakerStatusType,
  beskyttelsesmarkering: Beskyttelsesmarkering[],
  vurdering: Vurdering | null,
  navEnhet: string | null
): MockDeltaker => {
  const adresseBeskyttet = erAdresseBeskyttet(beskyttelsesmarkering)
  const erSkjermet = beskyttelsesmarkering.includes(
    Beskyttelsesmarkering.SKJERMET
  )

  const aktiveForslag =
    statusType === DeltakerStatusType.VENTER_PA_OPPSTART
      ? [
          createMockAktivtForslag({
            type: ForslagEndringType.IkkeAktuell,
            aarsak: {
              type: ForslagEndringAarsakType.FattJobb
            }
          })
        ]
      : []

  const ulesteHendelser = createUlesteHendelserMock(id)
  const tilfeldigAntallUleste = Math.floor(
    Math.random() * (ulesteHendelser.length / 2) + 1
  )
  const ulesteHendelserUtvalg = faker.helpers.arrayElements(
    ulesteHendelser,
    tilfeldigAntallUleste
  )

  const harOppdateringFraNav = ulesteHendelserUtvalg.some((ulestHendelse) =>
    [
      UlestHendelseType.IkkeAktuell,
      UlestHendelseType.AvsluttDeltakelse,
      UlestHendelseType.AvbrytDeltakelse,
      UlestHendelseType.ReaktiverDeltakelse
    ].includes(ulestHendelse.hendelse.type)
  )

  const erNyDeltaker = ulesteHendelserUtvalg.some((ulestHendelse) =>
    [
      UlestHendelseType.NavGodkjennUtkast,
      UlestHendelseType.InnbyggerGodkjennUtkast
    ].includes(ulestHendelse.hendelse.type)
  )

  return {
    id,
    fornavn: adresseBeskyttet
      ? 'Adressebeskyttet'
      : erSkjermet
        ? 'Skjermet person'
        : faker.person.firstName(),
    mellomnavn: null,
    etternavn: adresseBeskyttet || erSkjermet ? '' : faker.person.lastName(),
    fodselsnummer: faker.string.numeric(11),
    status: {
      type: statusType,
      aarsak:
        statusType === DeltakerStatusType.IKKE_AKTUELL
          ? {
              type: DeltakerStatusAarsakType.KURS_FULLT,
              beskrivelse: null
            }
          : null
    },
    vurdering,
    erManueltDeltMedArrangor: !!vurdering,
    beskyttelsesmarkering,
    navEnhet,
    startdato: faker.date.past(),
    sluttdato: faker.date.future(),
    navVeileder: {
      navn: adresseBeskyttet ? null : 'Veileder veiledersen',
      telefonnummer: adresseBeskyttet ? null : '87654321',
      epost: 'veileder.veiledersen@epost.no'
    },
    innsatsgruppe: InnsatsbehovType.STANDARD_INNSATS,
    tiltakskode: Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
    tilgangTilBruker: !adresseBeskyttet,
    ikkeDigitalOgManglerAdresse: true,
    harAktiveForslag: aktiveForslag.length > 0,
    erNyDeltaker: erNyDeltaker,
    harOppdateringFraNav: harOppdateringFraNav,
    aktiveForslag: aktiveForslag,
    kanEndres: statusType !== DeltakerStatusType.AVBRUTT,
    ulesteHendelser: ulesteHendelserUtvalg
  }
}

const createStatus = (index: number) => {
  if (index < 3) {
    return DeltakerStatusType.VENTER_PA_OPPSTART
  } else if (index < 6) {
    return DeltakerStatusType.IKKE_AKTUELL
  } else if (index < 10) {
    return DeltakerStatusType.AVBRUTT
  } else if (index < 14) {
    return DeltakerStatusType.FULLFORT
  } else if (index < 17) {
    return DeltakerStatusType.DELTAR
  }
  return DeltakerStatusType.SOKT_INN
}

const createVurdering = (index: number): Vurdering | null => {
  if (index < 3) {
    return {
      type: Vurderingstype.OPPFYLLER_KRAVENE,
      begrunnelse: null
    }
  } else if (index < 6) {
    return {
      type: Vurderingstype.OPPFYLLER_IKKE_KRAVENE,
      begrunnelse: 'Deltakeren oppfyller ikek kravene.'
    }
  }
  return null
}

const createBeskyttelsesmarkering = (index: number) => {
  if (index === 10) return [Beskyttelsesmarkering.SKJERMET]
  if (index === 11) return [Beskyttelsesmarkering.FORTROLIG]
  if (index === 12) return [Beskyttelsesmarkering.STRENGT_FORTROLIG]
  if (index === 13) return [Beskyttelsesmarkering.STRENGT_FORTROLIG_UTLAND]
  if (index === 15)
    return [
      Beskyttelsesmarkering.STRENGT_FORTROLIG,
      Beskyttelsesmarkering.SKJERMET
    ]

  return []
}

export const createMockDeltakere = (): MockDeltaker[] => {
  const deltakere = []
  for (let i = 0; i < 20; i++) {
    const navEnheter = ['Nav Grünerløkka', 'Nav Lade', 'Nav Madla', 'Nav Fana']

    deltakere.push(
      createMockDeltaker(
        `86a60e8c-888e-4f5c-8f55-1c83ee9949${i < 10 ? '0' : ''}${i}`,
        createStatus(i),
        createBeskyttelsesmarkering(i),
        createVurdering(i),
        navEnheter[i % navEnheter.length]
      )
    )
  }
  const deltakerMedStatusDeltar = deltakere.find(
    (deltaker) => deltaker.status.type === DeltakerStatusType.DELTAR
  )

  if (deltakerMedStatusDeltar) {
    deltakere.push({
      ...deltakerMedStatusDeltar,
      id: deltakerMedStatusDeltar.id.replace('888e', '888a'),
      status: {
        ...deltakerMedStatusDeltar.status,
        type: DeltakerStatusType.AVBRUTT
      }
    })
  }

  return deltakere
}

export const createMockDeltakerlisteDetaljer = (): DeltakerlisteDetaljer => {
  return {
    id: uuidv4(),
    navn: 'Kometrytter Kurs',
    tiltakskode: Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
    startdato: dayjs().subtract(1, 'month').toDate(),
    sluttdato: dayjs().add(1, 'year').toDate(),
    oppstartstype: Oppstartstype.FELLES,
    apentForPamelding: true,
    antallPlasser: 42,
    // TODO legge til pameldingstype
    koordinatorer: [
      {
        id: uuidv4(),
        navn: 'Navn Navnesen',
        erAktiv: true,
        kanFjernes: false
      },
      {
        id: uuidv4(),
        navn: 'This Is Me',
        erAktiv: true,
        kanFjernes: true
      },
      {
        id: uuidv4(),
        navn: 'Navn Etternavn',
        erAktiv: false,
        kanFjernes: false
      }
    ]
  }
}

export const lagMockDeltaker = (): Deltaker => {
  return {
    id: uuidv4(),
    fornavn: faker.person.firstName(),
    mellomnavn: null,
    etternavn: faker.person.lastName(),
    status: {
      type: DeltakerStatusType.SOKT_INN,
      aarsak: null
    },
    vurdering: null,
    beskyttelsesmarkering: [],
    navEnhet: 'Nav Grünerløkka',
    erManueltDeltMedArrangor: false,
    ikkeDigitalOgManglerAdresse: false,
    harAktiveForslag: false,
    erNyDeltaker: false,
    harOppdateringFraNav: false,
    kanEndres: true,
    startdato: null,
    sluttdato: null
  }
}

const createUlesteHendelserMock = (deltakerId: string): UlestHendelse[] => {
  return [
    {
      id: uuidv4(),
      deltakerId,
      opprettet: dayjs().subtract(1, 'day').toDate(),
      ansvarlig: {
        endretAvNavn: faker.person.fullName(),
        endretAvEnhet: 'NAV Oslo'
      },
      hendelse: {
        type: UlestHendelseType.InnbyggerGodkjennUtkast
      }
    },
    {
      id: uuidv4(),
      deltakerId,
      opprettet: dayjs().subtract(2, 'days').toDate(),
      ansvarlig: {
        endretAvNavn: faker.person.fullName(),
        endretAvEnhet: null
      },
      hendelse: {
        type: UlestHendelseType.NavGodkjennUtkast
      }
    },
    {
      id: uuidv4(),
      deltakerId,
      opprettet: dayjs().subtract(6, 'days').toDate(),
      ansvarlig: {
        endretAvNavn: faker.person.fullName(),
        endretAvEnhet: 'NAV Stavanger'
      },
      hendelse: {
        type: UlestHendelseType.IkkeAktuell,
        aarsak: {
          type: DeltakerStatusAarsakType.IKKE_MOTT,
          beskrivelse: null
        },
        begrunnelseFraNav: null,
        begrunnelseFraArrangor: 'Deltaker har ikke møtt',
        endringFraForslag: {
          type: ForslagEndringType.IkkeAktuell,
          aarsak: {
            type: ForslagEndringAarsakType.IkkeMott
          }
        }
      }
    },
    {
      id: uuidv4(),
      deltakerId,
      opprettet: dayjs().subtract(7, 'days').toDate(),
      ansvarlig: {
        endretAvNavn: faker.person.fullName(),
        endretAvEnhet: 'NAV Kristiansand'
      },
      hendelse: {
        type: UlestHendelseType.AvsluttDeltakelse,
        aarsak: {
          type: DeltakerStatusAarsakType.FATT_JOBB,
          beskrivelse: null
        },
        sluttdato: dayjs().subtract(1, 'day').toDate(),
        begrunnelseFraNav: null,
        begrunnelseFraArrangor: null,
        endringFraForslag: null
      }
    },
    {
      id: uuidv4(),
      deltakerId,
      opprettet: dayjs().subtract(8, 'days').toDate(),
      ansvarlig: {
        endretAvNavn: faker.person.fullName(),
        endretAvEnhet: null
      },
      hendelse: {
        type: UlestHendelseType.AvbrytDeltakelse,
        aarsak: {
          type: DeltakerStatusAarsakType.FATT_JOBB,
          beskrivelse: null
        },
        sluttdato: dayjs().subtract(2, 'days').toDate(),
        begrunnelseFraNav: null,
        begrunnelseFraArrangor: null,
        endringFraForslag: null
      }
    },
    {
      id: uuidv4(),
      deltakerId,
      opprettet: dayjs().subtract(9, 'days').toDate(),
      ansvarlig: {
        endretAvNavn: faker.person.fullName(),
        endretAvEnhet: 'NAV Tromsø'
      },
      hendelse: {
        type: UlestHendelseType.ReaktiverDeltakelse,
        begrunnelseFraNav: 'Deltaker ønsker å fortsette etter avbrudd'
      }
    }
  ]
}
