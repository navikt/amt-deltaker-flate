import { Select } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  getDeltakerStatusDisplayText,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { PameldingResponse, pameldingSchema } from '../../api/data/pamelding'
import { API_URL, useMock } from '../../utils/environment-utils'
import { usePameldingContext } from '../tiltak/PameldingContext'

export const endreMockDeltakelseStatus = (
  nyStatus: DeltakerStatusType
): Promise<PameldingResponse> => {
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
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

const DemoStatusInstillinger = () => {
  const { setPamelding } = usePameldingContext()

  const [pameldingStatus, setPameldingStatus] = useState<DeltakerStatusType>(
    DeltakerStatusType.KLADD
  )

  const { doFetch: doFetchEndreMockDeltakelseStatus } = useDeferredFetch(
    endreMockDeltakelseStatus
  )

  const handlePameldingStatusChange = (nyStatus: DeltakerStatusType) => {
    setPameldingStatus(nyStatus)
    if (useMock) {
      doFetchEndreMockDeltakelseStatus(nyStatus).then((data) => {
        if (data) {
          setPamelding(data as PameldingResponse)
        }
      })
    }
  }

  return (
    <Select
      value={pameldingStatus}
      label="Hvilken status skal påmeldingen ha?"
      size="small"
      className="mt-2 w-64"
      onChange={(e) =>
        handlePameldingStatusChange(e.target.value as DeltakerStatusType)
      }
    >
      <option value={DeltakerStatusType.KLADD}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.KLADD)}
      </option>
      <option value={DeltakerStatusType.UTKAST_TIL_PAMELDING}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.UTKAST_TIL_PAMELDING)}
      </option>
      <option value={DeltakerStatusType.AVBRUTT_UTKAST}>
        {getDeltakerStatusDisplayText(DeltakerStatusType.AVBRUTT_UTKAST)}
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
    </Select>
  )
}

export default DemoStatusInstillinger
