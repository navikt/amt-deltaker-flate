import { ReadMore, Select, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import { DeltakerStatusType, PameldingResponse, pameldingSchema } from '../../api/data/pamelding'
import { deltakerBffApiBasePath, useMock } from '../../utils/environment-utils'
import { useAppContext } from '../../AppContext'
import { usePameldingCOntext } from '../tiltak/PameldingContext'
import { useDeferredFetch } from '../../hooks/useDeferredFetch'
import { getDeltakerStatusDisplayText } from '../../utils/displayText'

interface Props {
  className: string
}

export const endreMockDeltakelseStatus = (
  nyStatus: DeltakerStatusType
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/setup/status/${nyStatus}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Kunne ikke endre status. Prøv igjen senere. (${response.status})`)
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

const DemoDeltakerInstillinger = ({ className }: Props) => {
  const { enhetId, personident, deltakerlisteId, setEnhetId, setPersonident, setDeltakelisteId } =
    useAppContext()
  const { setPamelding } = usePameldingCOntext()

  const [pameldingStatus, setPameldingStatus] = useState<DeltakerStatusType>(
    DeltakerStatusType.KLADD
  )

  const { doFetch: doFetchEndreMockDeltakelseStatus } = useDeferredFetch(endreMockDeltakelseStatus)

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
    <>
      {useMock && (
        <Select
          value={pameldingStatus}
          label="Hvilken status skal påmeldingen ha?"
          size="small"
          className="mt-2 w-64"
          onChange={(e) => handlePameldingStatusChange(e.target.value as DeltakerStatusType)}
        >
          <option value={DeltakerStatusType.KLADD}>
            {getDeltakerStatusDisplayText(DeltakerStatusType.KLADD)}
          </option>
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
        </Select>
      )}{' '}
      {!useMock && (
        <ReadMore className={className} size="small" header="Velg instillinger for deltaker">
          <>
            <TextField
              label="Personident (fødselsnummer etc)"
              type="number"
              size="small"
              className="mt-2"
              value={personident}
              onChange={(e) => setPersonident(e.target.value)}
            />

            <TextField
              label="Deltakerliste id (uuid)"
              size="small"
              className="mt-2"
              value={deltakerlisteId}
              onChange={(e) => setDeltakelisteId(e.target.value)}
            />

            <TextField
              label="Enhet id"
              size="small"
              className="mt-2"
              value={enhetId}
              onChange={(e) => setEnhetId(e.target.value)}
            />
          </>
        </ReadMore>
      )}
    </>
  )
}

export default DemoDeltakerInstillinger
