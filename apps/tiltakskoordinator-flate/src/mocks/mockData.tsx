import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import {
  Beskyttelsesmarkering,
  Deltaker,
  Deltakere,
  DeltakerlisteDetaljer,
  Vurderingstype
} from '../api/data/deltakerliste'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const createMockDeltaker = (
  statusType: DeltakerStatusType,
  beskyttelsesmarkering: Beskyttelsesmarkering[],
  vurdering: Vurderingstype | null,
  navEnhet: string | null
): Deltaker => {
  return {
    id: uuidv4(),
    fornavn: 'Navn',
    mellomnavn: null,
    etternavn: 'Naversen',
    status: {
      type: statusType,
      aarsak: null
    },
    vurdering,
    beskyttelsesmarkering,
    navEnhet
  }
}

export const createMockDeltakere = (): Deltakere => {
  const deltakere = []
  for (let i = 0; i < 15; i++) {
    let statusType = DeltakerStatusType.SOKT_INN
    let vurdering = null
    if (i < 3) {
      statusType = DeltakerStatusType.VENTER_PA_OPPSTART
      vurdering = Vurderingstype.OPPFYLLER_KRAVENE
    } else if (i < 6) {
      statusType = DeltakerStatusType.IKKE_AKTUELL
      vurdering = Vurderingstype.OPPFYLLER_IKKE_KRAVENE
    }
    let beskyttelsesmarkering: Beskyttelsesmarkering[] = []
    if (i === 10) beskyttelsesmarkering = [Beskyttelsesmarkering.SKJERMET]
    if (i === 11) beskyttelsesmarkering = [Beskyttelsesmarkering.FORTROLIG]
    if (i === 12)
      beskyttelsesmarkering = [Beskyttelsesmarkering.STRENGT_FORTROLIG]
    if (i === 13)
      beskyttelsesmarkering = [Beskyttelsesmarkering.STRENGT_FORTROLIG_UTLAND]
    if (i === 14)
      beskyttelsesmarkering = [
        Beskyttelsesmarkering.STRENGT_FORTROLIG,
        Beskyttelsesmarkering.SKJERMET
      ]

    const navEnheter = ['Nav Grünerløkka', 'Nav Lade', 'Nav Madla', 'Nav Fana']

    deltakere.push(
      createMockDeltaker(
        statusType,
        beskyttelsesmarkering,
        vurdering,
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
