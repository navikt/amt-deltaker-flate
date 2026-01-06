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
import { useEffect, useState } from 'react'
import { PameldingResponse, pameldingSchema } from '../../api/data/pamelding'
import { API_URL, useMock } from '../../utils/environment-utils'
import { usePameldingContext } from '../tiltak/PameldingContext'

export const endreMockTiltakskode = (
  nyTiltakskode: Tiltakskode
): Promise<PameldingResponse> => {
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

export const endreMockOppstartstype = (
  nyOppstartstype: Oppstartstype
): Promise<PameldingResponse> => {
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
        return pameldingSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerSchema:', error)
        throw error
      }
    })
}

export const endreMockPameldingstype = (
  nyPameldingstype: Pameldingstype
): Promise<PameldingResponse> => {
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
        return pameldingSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerSchema:', error)
        throw error
      }
    })
}

const DemoStatusInstillinger = () => {
  const { setPamelding } = usePameldingContext()

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

  const handleTiltakskodeChanged = (nyTiltakskode: Tiltakskode) => {
    setTiltakskode(nyTiltakskode)
    if (useMock) {
      doFetchEndreMockTiltakskode(nyTiltakskode).then((data) => {
        if (data) {
          setPamelding(data as PameldingResponse)
        }
      })
    }
  }

  const handleOppstartstypeChange = (nyOppstartstype: Oppstartstype) => {
    setOppstartsType(nyOppstartstype)
    if (useMock) {
      doFetchEndreMockOppstartstype(nyOppstartstype).then((data) => {
        if (data) {
          setPamelding(data as PameldingResponse)
        }
      })
    }
  }

  const handlePameldingstypeChange = (nyPameldingstype: Pameldingstype) => {
    setPameldingsType(nyPameldingstype)
    if (useMock) {
      doFetchEndreMockPameldingstype(nyPameldingstype).then((data) => {
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
        <option value={DeltakerStatusType.SOKT_INN}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.SOKT_INN)}
        </option>
        <option value={DeltakerStatusType.VENTELISTE}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.VENTELISTE)}
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
        <option value={DeltakerStatusType.AVBRUTT}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.AVBRUTT)}
        </option>
        <option value={DeltakerStatusType.FULLFORT}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.FULLFORT)}
        </option>
        <option value={DeltakerStatusType.FEILREGISTRERT}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.FEILREGISTRERT)}
        </option>
        <option value={DeltakerStatusType.IKKE_AKTUELL}>
          {getDeltakerStatusDisplayText(DeltakerStatusType.IKKE_AKTUELL)}
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
