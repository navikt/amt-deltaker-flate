import { Select } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  getDeltakerStatusDisplayText,
  getTiltakstypeDisplayText,
  logError,
  ArenaTiltakskode,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { PameldingResponse, pameldingSchema } from '../../api/data/pamelding'
import { API_URL, useMock } from '../../utils/environment-utils'
import { usePameldingContext } from '../tiltak/PameldingContext'

export const endreMockTiltakstype = (
  nyTiltakstype: ArenaTiltakskode
): Promise<PameldingResponse> => {
  return fetch(`${API_URL}/setup/tiltakstype/${nyTiltakstype}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre tiltakstype. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

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
        logError('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

const DemoStatusInstillinger = () => {
  const { setPamelding } = usePameldingContext()

  const [tiltaksType, setTiltaksType] = useState<ArenaTiltakskode>(
    ArenaTiltakskode.ARBFORB
  )
  const [pameldingStatus, setPameldingStatus] = useState<DeltakerStatusType>(
    DeltakerStatusType.KLADD
  )

  const { doFetch: doFetchEndreMockTiltakstype } =
    useDeferredFetch(endreMockTiltakstype)
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

  const handleTiltakstypeChanged = (nyTiltakstype: ArenaTiltakskode) => {
    setTiltaksType(nyTiltakstype)
    if (useMock) {
      doFetchEndreMockTiltakstype(nyTiltakstype).then((data) => {
        if (data) {
          setPamelding(data as PameldingResponse)
        }
      })
    }
  }

  useEffect(() => {
    handlePameldingStatusChange(DeltakerStatusType.DELTAR)
  }, [])

  return (
    <div className="mt-2 flex gap-4 flex-wrap">
      <Select
        value={tiltaksType}
        label="Velg tiltakstype"
        size="small"
        className="w-64"
        data-testid="select_tiltakstype"
        onChange={(e) =>
          handleTiltakstypeChanged(e.target.value as ArenaTiltakskode)
        }
      >
        <option value={ArenaTiltakskode.ARBFORB}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.ARBFORB)}
        </option>
        <option value={ArenaTiltakskode.ARBRRHDAG}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.ARBRRHDAG)}
        </option>
        <option value={ArenaTiltakskode.AVKLARAG}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.AVKLARAG)}
        </option>
        <option value={ArenaTiltakskode.INDOPPFAG}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.INDOPPFAG)}
        </option>
        <option value={ArenaTiltakskode.DIGIOPPARB}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.DIGIOPPARB)}
        </option>
        <option value={ArenaTiltakskode.VASV}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.VASV)}
        </option>
        <option value={ArenaTiltakskode.GRUPPEAMO}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.GRUPPEAMO)}
        </option>
        <option value={ArenaTiltakskode.JOBBK}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.JOBBK)}
        </option>
        <option value={ArenaTiltakskode.GRUFAGYRKE}>
          {getTiltakstypeDisplayText(ArenaTiltakskode.GRUFAGYRKE)}
        </option>
      </Select>
      <Select
        value={pameldingStatus}
        label="Hvilken status skal påmeldingen ha?"
        size="small"
        className="w-64"
        data-testid="select_status"
        onChange={(e) =>
          handlePameldingStatusChange(e.target.value as DeltakerStatusType)
        }
      >
        <option value={DeltakerStatusType.KLADD}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.KLADD)}
        </option>
        <option value={DeltakerStatusType.UTKAST_TIL_PAMELDING}>
          {getDeltakerStatusDisplayText(
            DeltakerStatusType.UTKAST_TIL_PAMELDING
          )}
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
        <option value={DeltakerStatusType.FEILREGISTRERT}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.FEILREGISTRERT)}
        </option>
        <option value={DeltakerStatusType.IKKE_AKTUELL}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.IKKE_AKTUELL)}
        </option>
      </Select>
    </div>
  )
}

export default DemoStatusInstillinger
