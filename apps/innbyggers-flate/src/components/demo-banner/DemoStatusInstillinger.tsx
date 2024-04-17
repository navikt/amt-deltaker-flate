import { Select } from '@navikt/ds-react'
import { useState } from 'react'
import { deltakerBffApiBasePath, useMock } from '../../utils/environment-utils'
import { useDeferredFetch } from '../../hooks/useDeferredFetch'
import { useDeltakerContext } from '../../DeltakerContext.tsx'
import {
  DeltakerResponse,
  deltakerSchema,
  DeltakerStatusType
} from '../../api/data/deltaker.ts'
import { getDeltakerStatusDisplayText } from '../../utils/utils.ts'

export const endreMockDeltakelseStatus = (
  nyStatus: DeltakerStatusType
): Promise<DeltakerResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/setup/status/${nyStatus}`, {
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
        console.error('Kunne ikke parse deltakerSchema:', error)
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
    </Select>
  )
}

export default DemoStatusInstillinger
