import { Select } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  getDeltakerStatusDisplayText,
  logError,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useDeltakerContext } from '../../DeltakerContext.tsx'
import { DeltakerResponse, deltakerSchema } from '../../api/data/deltaker.ts'
import { API_URL, useMock } from '../../utils/environment-utils'

export const endreMockDeltakelseStatus = (
  nyStatus: DeltakerStatusType
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/setup/status/${nyStatus}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre status. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerSchema:', error)
        throw error
      }
    })
}

const DemoStatusInstillinger = () => {
  const { setDeltaker } = useDeltakerContext()

  const [deltakerStatus, setDeltakerStatus] = useState<DeltakerStatusType>(
    DeltakerStatusType.UTKAST_TIL_PAMELDING
  )

  const { doFetch: doFetchEndreMockDeltakelseStatus } = useDeferredFetch(
    endreMockDeltakelseStatus
  )

  const handleDeltakerStatusChange = (nyStatus: DeltakerStatusType) => {
    setDeltakerStatus(nyStatus)
    if (useMock) {
      doFetchEndreMockDeltakelseStatus(nyStatus).then((data) => {
        if (data) {
          setDeltaker(data as DeltakerResponse)
        }
      })
    }
  }

  return (
    <Select
      value={deltakerStatus}
      label="Hvilken status skal deltakeren ha?"
      data-testid="select_deltaker_status"
      size="small"
      className="mt-2 w-64"
      onChange={(e) =>
        handleDeltakerStatusChange(e.target.value as DeltakerStatusType)
      }
    >
      <option value={DeltakerStatusType.UTKAST_TIL_PAMELDING}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.UTKAST_TIL_PAMELDING)}
      </option>
      <option value={DeltakerStatusType.VENTER_PA_OPPSTART}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.VENTER_PA_OPPSTART)}
      </option>
      <option value={DeltakerStatusType.DELTAR}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.DELTAR)}
      </option>
      <option value={DeltakerStatusType.HAR_SLUTTET}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.HAR_SLUTTET)}
      </option>
      <option value={DeltakerStatusType.AVBRUTT_UTKAST}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.AVBRUTT_UTKAST)}
      </option>
      <option value={DeltakerStatusType.IKKE_AKTUELL}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.IKKE_AKTUELL)}
      </option>
      <option value={DeltakerStatusType.FEILREGISTRERT}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.FEILREGISTRERT)}
      </option>
    </Select>
  )
}

export default DemoStatusInstillinger
