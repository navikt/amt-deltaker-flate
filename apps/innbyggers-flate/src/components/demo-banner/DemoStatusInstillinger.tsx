import { Select } from '@navikt/ds-react'
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
import { useState } from 'react'
import { useDeltakerContext } from '../../DeltakerContext.tsx'
import { DeltakerResponse, deltakerSchema } from '../../api/data/deltaker.ts'
import { API_URL, useMock } from '../../utils/environment-utils'

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
        logError('Kunne ikke parse deltakerSchema:', error)
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
        logError('Kunne ikke parse deltakerSchema:', error)
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

const DemoStatusInstillinger = () => {
  const { setDeltaker } = useDeltakerContext()

  const [tiltakskode, setTiltakskode] = useState<Tiltakskode>(
    Tiltakskode.ARBEIDSFORBEREDENDE_TRENING
  )
  const [deltakerStatus, setDeltakerStatus] = useState<DeltakerStatusType>(
    DeltakerStatusType.UTKAST_TIL_PAMELDING
  )
  const [oppstartsType, setOppstartsType] = useState<Oppstartstype>(
    Oppstartstype.LOPENDE
  )
  const [pameldingsType, setPameldingsType] = useState<Pameldingstype>(
    Pameldingstype.DIREKTE_VEDTAK
  )

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
        <option value={Tiltakskode.ARBEIDSFORBEREDENDE_TRENING}>
          {getTiltakskodeDisplayText(Tiltakskode.ARBEIDSFORBEREDENDE_TRENING)}
        </option>
        <option value={Tiltakskode.ARBEIDSRETTET_REHABILITERING}>
          {getTiltakskodeDisplayText(Tiltakskode.ARBEIDSRETTET_REHABILITERING)}
        </option>
        <option value={Tiltakskode.AVKLARING}>
          {getTiltakskodeDisplayText(Tiltakskode.AVKLARING)}
        </option>
        <option value={Tiltakskode.OPPFOLGING}>
          {getTiltakskodeDisplayText(Tiltakskode.OPPFOLGING)}
        </option>
        <option value={Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK}>
          {getTiltakskodeDisplayText(Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK)}
        </option>
        <option value={Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET}>
          {getTiltakskodeDisplayText(
            Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
          )}
        </option>
        <option value={Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING}>
          {getTiltakskodeDisplayText(
            Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING
          )}
        </option>
        <option value={Tiltakskode.JOBBKLUBB}>
          {getTiltakskodeDisplayText(Tiltakskode.JOBBKLUBB)}
        </option>
        <option value={Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING}>
          {getTiltakskodeDisplayText(Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING)}
        </option>
        <option value={Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING}>
          {getTiltakskodeDisplayText(
            Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING
          )}
        </option>
        <option value={Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING}>
          {getTiltakskodeDisplayText(
            Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING
          )}
        </option>
        <option value={Tiltakskode.HOYERE_UTDANNING}>
          {getTiltakskodeDisplayText(Tiltakskode.HOYERE_UTDANNING)}
        </option>
        <option value={Tiltakskode.ARBEIDSMARKEDSOPPLAERING}>
          {getTiltakskodeDisplayText(Tiltakskode.ARBEIDSMARKEDSOPPLAERING)}
        </option>
        <option
          value={Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV}
        >
          {getTiltakskodeDisplayText(
            Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV
          )}
        </option>
        <option value={Tiltakskode.STUDIESPESIALISERING}>
          {getTiltakskodeDisplayText(Tiltakskode.STUDIESPESIALISERING)}
        </option>
        <option value={Tiltakskode.FAG_OG_YRKESOPPLAERING}>
          {getTiltakskodeDisplayText(Tiltakskode.FAG_OG_YRKESOPPLAERING)}
        </option>
        <option value={Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING}>
          {getTiltakskodeDisplayText(Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING)}
        </option>
      </Select>
      <Select
        value={deltakerStatus}
        label="Hvilken status skal deltakeren ha?"
        data-testid="select_deltaker_status"
        size="small"
        className="w-64"
        onChange={(e) =>
          handleDeltakerStatusChange(e.target.value as DeltakerStatusType)
        }
      >
        <option value={DeltakerStatusType.UTKAST_TIL_PAMELDING}>
          {getDeltakerStatusDisplayText(
            DeltakerStatusType.UTKAST_TIL_PAMELDING
          )}
        </option>
        <option value={DeltakerStatusType.SOKT_INN}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.SOKT_INN)}
        </option>
        <option value={DeltakerStatusType.VENTELISTE}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.VENTELISTE)}
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
        <option value={DeltakerStatusType.AVBRUTT}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.AVBRUTT)}
        </option>
        <option value={DeltakerStatusType.FULLFORT}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.FULLFORT)}
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
        <option value={Oppstartstype.LOPENDE}>
          {getOppstartstypeDisplayText(Oppstartstype.LOPENDE)}
        </option>
        <option value={Oppstartstype.FELLES}>
          {getOppstartstypeDisplayText(Oppstartstype.FELLES)}
        </option>
      </Select>
      <Select
        value={pameldingsType}
        label="Velg påmeldingstype"
        data-testid="select_påmeldingstype"
        size="small"
        className="w-64"
        onChange={(e) =>
          handlePameldingstypeChange(e.target.value as Pameldingstype)
        }
      >
        <option value={Pameldingstype.DIREKTE_VEDTAK}>
          {getPameldingstypeDisplayText(Pameldingstype.DIREKTE_VEDTAK)}
        </option>
        <option value={Pameldingstype.TRENGER_GODKJENNING}>
          {getPameldingstypeDisplayText(Pameldingstype.TRENGER_GODKJENNING)}
        </option>
      </Select>
    </div>
  )
}

export default DemoStatusInstillinger
