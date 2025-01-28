import { DeltakerStatusType } from 'deltaker-flate-common'
import {
  Deltaker,
  Deltakere,
  DeltakerlisteDetaljer
} from '../api/data/deltakerliste'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const createMockDeltaker = (statusType: DeltakerStatusType): Deltaker => {
  return {
    id: uuidv4(),
    fornavn: 'Navn',
    mellomnavn: null,
    etternavn: 'Naversen',
    status: {
      type: statusType,
      aarsak: null
    }
  }
}

export const createMockDeltakere = (): Deltakere => {
  const deltakere = []
  for (let i = 0; i < 15; i++) {
    let statusType = DeltakerStatusType.SOKT_INN
    if (i < 3) statusType = DeltakerStatusType.VENTER_PA_OPPSTART
    else if (i < 6) statusType = DeltakerStatusType.IKKE_AKTUELL

    deltakere.push(createMockDeltaker(statusType))
  }
  return deltakere
}

export const createMockDeltakerlisteDetaljer = (): DeltakerlisteDetaljer => {
  return {
    id: uuidv4(),
    startdato: dayjs().subtract(1, 'month').toDate(),
    sluttdato: dayjs().add(1, 'year').toDate(),
    apentForPamelding: true,
    antallPlasser: 42
  }
}
