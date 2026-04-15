import { Checkbox, Select } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  getDeltakerStatusDisplayText,
  getOppstartstypeDisplayText,
  getPameldingstypeDisplayText,
  getTiltakskodeDisplayText,
  logError,
  Oppstartstype,
  Pameldingstype,
  Tiltakskode,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { DeltakerResponse, deltakerSchema } from '../../api/data/deltaker'
import { API_URL, useMock } from '../../utils/environment-utils'
import { useDeltakerContext } from '../tiltak/DeltakerContext'

export const endreMockTiltakskode = (
  nyTiltakskode: Tiltakskode
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/setup/tiltakskode/${nyTiltakskode}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre tiltakskode. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

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
        logError('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const endreMockOppstartstype = (
  nyOppstartstype: Oppstartstype
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/setup/oppstartstype/${nyOppstartstype}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre oppstartstype. Prøv igjen senere. (${response.status})`
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

export const endreMockPameldingstype = (
  nyPameldingstype: Pameldingstype
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/setup/pameldingstype/${nyPameldingstype}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre påmeldingstype. Prøv igjen senere. (${response.status})`
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

export const endreMockEnkeltplass = (
  erEnkeltplass: boolean
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/setup/er-enkeltplass/${erEnkeltplass}`, {
    method: 'POST'
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre enkeltplass. Prøv igjen senere. (${response.status})`
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

  const [tiltakskode, setTiltakskode] = useState<Tiltakskode>(
    Tiltakskode.ARBEIDSFORBEREDENDE_TRENING
  )
  const [pameldingStatus, setPameldingStatus] = useState<DeltakerStatusType>(
    DeltakerStatusType.KLADD
  )
  const [oppstartsType, setOppstartsType] = useState<Oppstartstype>(
    Oppstartstype.LOPENDE
  )
  const [pameldingsType, setPameldingsType] = useState<Pameldingstype>(
    Pameldingstype.TRENGER_GODKJENNING
  )

  const [erEnkeltplass, setErEnkeltplass] = useState<boolean>(true)

  const { doFetch: doFetchEndreMockTiltakskode } =
    useDeferredFetch(endreMockTiltakskode)
  const { doFetch: doFetchEndreMockDeltakelseStatus } = useDeferredFetch(
    endreMockDeltakelseStatus
  )
  const { doFetch: doFetchEndreMockOppstartstype } = useDeferredFetch(
    endreMockOppstartstype
  )
  const { doFetch: doFetchEndreMockPameldingstype } = useDeferredFetch(
    endreMockPameldingstype
  )
  const { doFetch: doFetchEndreMockEnkeltplass } =
    useDeferredFetch(endreMockEnkeltplass)

  const handlePameldingStatusChange = (nyStatus: DeltakerStatusType) => {
    setPameldingStatus(nyStatus)
    if (useMock) {
      doFetchEndreMockDeltakelseStatus(nyStatus).then((data) => {
        if (data) {
          setDeltaker(data as DeltakerResponse)
        }
      })
    }
  }

  const handleTiltakskodeChanged = (nyTiltakskode: Tiltakskode) => {
    setTiltakskode(nyTiltakskode)
    if (useMock) {
      doFetchEndreMockTiltakskode(nyTiltakskode).then((data) => {
        if (data) {
          setDeltaker(data as DeltakerResponse)
        }
      })
    }
  }

  const handleOppstartstypeChange = (nyOppstartstype: Oppstartstype) => {
    setOppstartsType(nyOppstartstype)
    if (useMock) {
      doFetchEndreMockOppstartstype(nyOppstartstype).then((data) => {
        if (data) {
          setDeltaker(data as DeltakerResponse)
        }
      })
    }
  }

  const handlePameldingstypeChange = (nyPameldingstype: Pameldingstype) => {
    setPameldingsType(nyPameldingstype)
    if (useMock) {
      doFetchEndreMockPameldingstype(nyPameldingstype).then((data) => {
        if (data) {
          setDeltaker(data as DeltakerResponse)
        }
      })
    }
  }

  const handleErEnkeltplassChange = (erEnkeltplass: boolean) => {
    setErEnkeltplass(erEnkeltplass)
    if (useMock) {
      doFetchEndreMockEnkeltplass(erEnkeltplass).then((data) => {
        if (data) {
          setDeltaker(data as DeltakerResponse)
        }
      })
    }
  }

  useEffect(() => {
    handlePameldingStatusChange(DeltakerStatusType.KLADD)
  }, [])

  return (
    <div className="mt-2 flex gap-4 flex-wrap">
      <Select
        value={tiltakskode}
        label="Velg tiltakskode"
        size="small"
        className="w-64"
        data-testid="select_tiltakskode"
        onChange={(e) =>
          handleTiltakskodeChanged(e.target.value as Tiltakskode)
        }
      >
        {Object.values(Tiltakskode).map((kode) => (
          <option key={kode} value={kode}>
            {getTiltakskodeDisplayText(kode)}
          </option>
        ))}
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
        {Object.values(DeltakerStatusType).map((status) => (
          <option key={status} value={status}>
            {getDeltakerStatusDisplayText(status)}
          </option>
        ))}
      </Select>

      <Select
        value={oppstartsType}
        label="Velg oppstartstype"
        data-testid="select_oppstartstype"
        size="small"
        className="w-64"
        onChange={(e) =>
          handleOppstartstypeChange(e.target.value as Oppstartstype)
        }
      >
        {Object.values(Oppstartstype).map((type) => (
          <option key={type} value={type}>
            {getOppstartstypeDisplayText(type)}
          </option>
        ))}
      </Select>

      <Select
        value={pameldingsType}
        label="Velg påmeldingstype"
        data-testid="select_pameldingstype"
        size="small"
        className="w-64"
        onChange={(e) =>
          handlePameldingstypeChange(e.target.value as Pameldingstype)
        }
      >
        {Object.values(Pameldingstype).map((type) => (
          <option key={type} value={type}>
            {getPameldingstypeDisplayText(type)}
          </option>
        ))}
      </Select>

      <Checkbox
        className="self-end -mb-2"
        checked={erEnkeltplass}
        onChange={(e) => handleErEnkeltplassChange(e.target.checked)}
      >
        Er enkeltplass
      </Checkbox>
    </div>
  )
}

export default DemoStatusInstillinger
