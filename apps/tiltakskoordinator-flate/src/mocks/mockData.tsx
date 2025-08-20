import { faker } from '@faker-js/faker/locale/nb_NO'
import dayjs from 'dayjs'
import {
  createMockAktivtForslag,
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  ForslagEndringAarsakType,
  ForslagEndringType,
  Tiltakskode
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
  DeltakerlisteDetaljer,
  Vurderingstype
} from '../api/data/deltakerliste'
import { erAdresseBeskyttet } from '../utils/utils.ts'

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
    aktiveForslag,
    kanEndres: statusType !== DeltakerStatusType.AVBRUTT
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
    apentForPamelding: true,
    antallPlasser: 42,
    koordinatorer: [
      {
        id: uuidv4(),
        navn: 'Navn Navnesen'
      },
      {
        id: uuidv4(),
        navn: 'To Navn Etternavn'
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
    kanEndres: true
  }
}
