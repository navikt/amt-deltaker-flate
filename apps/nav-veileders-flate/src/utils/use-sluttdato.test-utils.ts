import dayjs from 'dayjs'
import type { DeltakerResponse } from '../api/data/deltaker'

export const createDeltaker = (
  startdato?: string,
  sluttdato?: string,
  maxVarighetMnd?: number,
  softMaxVarighetMnd?: number
): DeltakerResponse => {
  return {
    startdato,
    sluttdato,
    deltakerliste: {
      sluttdato: dayjs('2030-02-20').toDate()
    },
    maxVarighet: dayjs.duration(maxVarighetMnd ?? 12, 'month').asMilliseconds(),
    softMaxVarighet: dayjs
      .duration(softMaxVarighetMnd ?? 12, 'month')
      .asMilliseconds()
  } as unknown as DeltakerResponse
}

export const deltakerUtenDatoer = createDeltaker()
export const deltakerMedDatoer = createDeltaker(
  '2024-07-17',
  '2024-07-20',
  6,
  3
)

export const senesteSluttdatoFeilmelding =
  /^Seneste tillatte sluttdato er \d{2}\.\d{2}\.\d{4}\.$/
