import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import {
  Beskyttelsesmarkering,
  Deltaker,
  DeltakerlisteDetaljer,
  Vurderingstype
} from '../api/data/deltakerliste'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import {
  DeltakerDetaljer,
  InnsatsbehovType,
  Vurdering
} from '../api/data/deltaker.ts'
import { faker } from '@faker-js/faker/locale/nb_NO'

export const mapDeltakerDeltaljerToDeltaker = (
  deltakerDetaljer: DeltakerDetaljer
): Deltaker => {
  return {
    ...deltakerDetaljer,
    vurdering: deltakerDetaljer.vurdering?.type ?? null
  }
}

const createMockDeltaker = (
  statusType: DeltakerStatusType,
  beskyttelsesmarkering: Beskyttelsesmarkering[],
  vurdering: Vurdering | null,
  navEnhet: string | null
): DeltakerDetaljer => {
  return {
    id: uuidv4(),
    fornavn: faker.person.firstName(),
    mellomnavn: null,
    etternavn: faker.person.lastName(),
    fodselsnummer: '3490823094',
    status: {
      type: statusType,
      aarsak: null
    },
    vurdering,
    beskyttelsesmarkering,
    navEnhet,
    startdato: null,
    sluttdato: null,
    kontaktinformasjon: {
      telefonnummer: '12345678',
      epost: 'tralala@epost.no',
      adresse: 'helsfyr 3, 3048 Oslo'
    },
    navVeileder: {
      navn: 'Veileder veiledersen',
      telefonnummer: '87654321',
      epost: 'veileder.veiledersen@epost.no'
    },
    innsatsgruppe: InnsatsbehovType.STANDARD_INNSATS
  }
}
const createStatus = (index: number) => {
  if (index < 3) {
    return DeltakerStatusType.VENTER_PA_OPPSTART
  } else if (index < 6) {
    return DeltakerStatusType.IKKE_AKTUELL
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
      begrunnelse: 'Passer ikke'
    }
  }
  return null
}

const createBeskyttelsesmarkering = (index: number) => {
  if (index === 10) return [Beskyttelsesmarkering.SKJERMET]
  if (index === 11) return [Beskyttelsesmarkering.FORTROLIG]
  if (index === 12) return [Beskyttelsesmarkering.STRENGT_FORTROLIG]
  if (index === 13) return [Beskyttelsesmarkering.STRENGT_FORTROLIG_UTLAND]
  if (index === 14)
    return [
      Beskyttelsesmarkering.STRENGT_FORTROLIG,
      Beskyttelsesmarkering.SKJERMET
    ]

  return []
}

export const createMockDeltakere = (): DeltakerDetaljer[] => {
  const deltakere = []
  for (let i = 0; i < 15; i++) {
    const navEnheter = ['Nav Grünerløkka', 'Nav Lade', 'Nav Madla', 'Nav Fana']

    deltakere.push(
      createMockDeltaker(
        createStatus(i),
        createBeskyttelsesmarkering(i),
        createVurdering(i),
        navEnheter[i % navEnheter.length]
      )
    )
  }
  return deltakere
}

export const createMockDeltakerlisteDetaljer = (): DeltakerlisteDetaljer => {
  return {
    id: uuidv4(),
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
