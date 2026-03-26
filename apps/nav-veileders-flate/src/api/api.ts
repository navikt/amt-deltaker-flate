import {
  DeltakerHistorikkListe,
  deltakerHistorikkListeSchema,
  logError
} from 'deltaker-flate-common'
import { ZodError } from 'zod'
import { API_URL } from '../utils/environment-utils.ts'
import { DeltakerRequest } from './data/deltaker-request.ts'
import {
  AvsluttDeltakelseRequest,
  AvvisForslagRequest,
  EndreAvslutningRequest,
  EndreBakgrunnsinfoRequest,
  EndreDeltakelsesmengdeRequest,
  EndreInnholdRequest,
  EndreSluttarsakRequest,
  EndreStartdatoRequest,
  FjernOppstartsdatoRequest,
  ForlengDeltakelseRequest,
  IkkeAktuellRequest,
  ReaktiverDeltakelseRequest
} from './data/endre-deltakelse-request.ts'
import { KladdRequest, OpprettKladdRequest } from './data/kladd-request.ts'
import { DeltakerResponse, pameldingSchema } from './data/pamelding.ts'
import { PameldingRequest } from './data/send-pamelding.ts'
import {
  DELTAKER_FOR_UNG_ERROR,
  ERROR_PERSONIDENT,
  handleError,
  parsePamelding
} from './utils.ts'

export const opprettKladd = async (
  personident: string,
  deltakerlisteId: string,
  enhetId: string
): Promise<DeltakerResponse> => {
  const request: OpprettKladdRequest = {
    personident: personident,
    deltakerlisteId: deltakerlisteId
  }

  return fetch(`${API_URL}/kladd`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then(async (response) => {
      if (response.status !== 200) {
        logError(
          `Deltakelse kunne ikke hentes / opprettes for deltakerlisteId: ${deltakerlisteId}`,
          response.status
        )

        const data = await response.text()
        if (data.includes(DELTAKER_FOR_UNG_ERROR)) {
          throw new Error(
            'Brukeren har ikke fylt 19 år når tiltaket starter, og kan derfor ikke delta.'
          )
        } else {
          throw new Error(
            'Kunne ikke opprette kladd for påmelding. Prøv igjen senere'
          )
        }
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const deleteKladd = (deltakerId: string): Promise<number> => {
  return fetch(`${API_URL}/kladd/${deltakerId}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then((response) => {
    if (response.status !== 200) {
      const message = 'Kladd kunne ikke slettes.'
      handleError(message, deltakerId, response.status)
    }
    return response.status
  })
}

export const getDeltaker = async (
  deltakerId: string,
  personident: string,
  enhetId: string
): Promise<DeltakerResponse> => {
  const request: DeltakerRequest = {
    personident: personident
  }

  return fetch(`${API_URL}/deltaker/${deltakerId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status === 400) {
        logError(`Deltakelse ${deltakerId} kunne ikke hentes.`, response.status)
        throw new Error(ERROR_PERSONIDENT)
      }
      if (response.status !== 200) {
        const message = 'Deltakelse kunne ikke hentes.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const oppdaterUtkast = async (
  deltakerId: string,
  enhetId: string,
  request: PameldingRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/pamelding/${deltakerId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Påmeldingen kunne ikke sendes inn.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const sendInnPameldingUtenGodkjenning = (
  deltakerId: string,
  enhetId: string,
  request: PameldingRequest
): Promise<number> => {
  return fetch(`${API_URL}/pamelding/${deltakerId}/utenGodkjenning`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  }).then((response) => {
    if (response.status !== 200) {
      const message = 'Påmeldingen uten godkjenning kunne ikke sendes inn.'
      handleError(message, deltakerId, response.status)
    }
    return response.status
  })
}

export const endreDeltakelseIkkeAktuell = (
  deltakerId: string,
  enhetId: string,
  request: IkkeAktuellRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/ikke-aktuell`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke utføre endringen å sette til ikke aktuell.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreDeltakelseReaktiver = (
  deltakerId: string,
  enhetId: string,
  request: ReaktiverDeltakelseRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/reaktiver`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke endre til aktiv deltakelse.'
        handleError(message, deltakerId, response.status)
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

export const endreDeltakelseForleng = (
  deltakerId: string,
  enhetId: string,
  request: ForlengDeltakelseRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/forleng`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke forlenge deltakelsen.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreDeltakelseFjernOppstartsdato = (
  deltakerId: string,
  enhetId: string,
  request: FjernOppstartsdatoRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/fjern-oppstartsdato`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke fjerne oppstartsdato.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreDeltakelseStartdato = (
  deltakerId: string,
  enhetId: string,
  request: EndreStartdatoRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/startdato`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke endre oppstartsdato.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreDeltakelseSluttarsak = (
  deltakerId: string,
  enhetId: string,
  request: EndreSluttarsakRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/sluttarsak`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke endre sluttårsak.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const avsluttDeltakelse = (
  deltakerId: string,
  enhetId: string,
  request: AvsluttDeltakelseRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/avslutt`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke avslutte deltakelsen.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreAvslutning = (
  deltakerId: string,
  enhetId: string,
  request: EndreAvslutningRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/endre-avslutning`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke endre avslutning til deltakeren.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreDeltakelseBakgrunnsinfo = (
  deltakerId: string,
  enhetId: string,
  request: EndreBakgrunnsinfoRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/bakgrunnsinformasjon`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke endre bakgrunnsinfo..'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreDeltakelseInnhold = (
  deltakerId: string,
  enhetId: string,
  request: EndreInnholdRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/innhold`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke endre innhold.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const endreDeltakelsesmengde = (
  deltakerId: string,
  enhetId: string,
  request: EndreDeltakelsesmengdeRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/deltakelsesmengde`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke endre deltakelsesmengde.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const avvisForslag = (
  forslagId: string,
  enhetId: string,
  request: AvvisForslagRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/forslag/${forslagId}/avvis`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  })
    .then((response) => {
      if (response.status !== 200) {
        logError(
          `Kunne ikke avvise forslaget. ForslagId: ${forslagId}`,
          response.status
        )
        throw new Error('Kunne ikke avvise forslaget. Prøv igjen senere.')
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const avbrytUtkast = (
  deltakerId: string,
  enhetId: string
): Promise<number> => {
  return fetch(`${API_URL}/pamelding/${deltakerId}/avbryt`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    }
  }).then((response) => {
    if (response.status !== 200) {
      const message = 'Kunne ikke avbryte utkastet.'
      handleError(message, deltakerId, response.status)
    }
    return response.status
  })
}

export const oppdaterKladd = async (
  deltakerId: string,
  enhetId: string,
  request: KladdRequest
): Promise<number> => {
  return fetch(`${API_URL}/kladd/${deltakerId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    },
    body: JSON.stringify(request)
  }).then((response) => {
    if (response.status !== 200) {
      const message = 'Kunne ikke lagre kladd.'
      handleError(message, deltakerId, response.status)
    }
    return response.status
  })
}

export const getHistorikk = async (
  deltakerId: string
): Promise<DeltakerHistorikkListe> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/historikk`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Endringer kunne ikke hentes.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerHistorikkListeSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerHistorikkListeSchema:', error)
        if (error instanceof ZodError) {
          logError('Issue', error.issues)
        }
        throw new Error('Kunne ikke laste inn endringene. Prøv igjen senere')
      }
    })
}
