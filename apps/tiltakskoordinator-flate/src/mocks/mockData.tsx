import { DeltakerStatusType, Tiltakstype } from 'deltaker-flate-common'
import {
  Deltaker,
  Deltakere,
  DeltakerlisteDetaljer
} from '../api/data/deltakerliste'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const createMockDeltaker = (statusType: DeltakerStatusType): Deltaker => {
  const yesterday = dayjs().subtract(1, 'day')

  return {
    deltakerId: uuidv4(),
    navn: 'Navn Navnesen',
    status: {
      id: '5ac4076b-7b09-4883-9db1-bc181bd8d4f8',
      type: statusType,
      aarsak: null,
      gyldigFra: yesterday.toDate(),
      gyldigTil: null,
      opprettet: yesterday.toDate()
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

export const createMockDeltakerlisteDetaljer = (
  tiltakstype: Tiltakstype
): DeltakerlisteDetaljer => {
  return {
    deltakerlisteId: uuidv4(),
    tiltakstype: tiltakstype,
    startdato: dayjs().subtract(1, 'month').toDate(),
    sluttdato: dayjs().add(1, 'year').toDate(),
    apenForPamelding: true
  }
}
