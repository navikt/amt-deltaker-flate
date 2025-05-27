import {
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  Tiltakskode
} from 'deltaker-flate-common'
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
import { erAdresseBeskyttet } from '../utils/utils.ts'

export const mapDeltakerDeltaljerToDeltaker = (
  deltakerDetaljer: DeltakerDetaljer
): Deltaker => {
  return {
    ...deltakerDetaljer,
    vurdering: deltakerDetaljer.vurdering?.type ?? null,
    erManueltDeltMedArrangor: !!deltakerDetaljer.vurdering
  }
}

export const createMockDeltaker = (
  id: string,
  statusType: DeltakerStatusType,
  beskyttelsesmarkering: Beskyttelsesmarkering[],
  vurdering: Vurdering | null,
  navEnhet: string | null
): DeltakerDetaljer => {
  const adresseBeskyttet = erAdresseBeskyttet(beskyttelsesmarkering)
  return {
    id,
    fornavn: adresseBeskyttet ? 'Adressebeskyttet' : faker.person.firstName(),
    mellomnavn: null,
    etternavn: adresseBeskyttet ? '' : faker.person.lastName(),
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
    tiltakskode: Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING
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
        `86a60e8c-888e-4f5c-8f55-1c83ee9949${i < 10 ? '0' : ''}${i}`,
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
