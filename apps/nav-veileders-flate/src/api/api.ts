import {
  DeltakerHistorikkListe,
  deltakerHistorikkListeSchema,
  logError
} from 'deltaker-flate-common'
import { ZodError } from 'zod'
import { API_URL } from '../utils/environment-utils.ts'
import {
  AvsluttDeltakelseRequest,
  AvvisForslagRequest,
  EndreBakgrunnsinfoRequest,
  EndreDeltakelsesmengdeRequest,
  EndreInnholdRequest,
  EndreSluttarsakRequest,
  EndreSluttdatoRequest,
  EndreStartdatoRequest,
  FjernOppstartsdatoRequest,
  ForlengDeltakelseRequest,
  IkkeAktuellRequest,
  ReaktiverDeltakelseRequest
} from './data/endre-deltakelse-request.ts'
import { KladdRequest } from './data/kladd-request.ts'
import { DeltakerRequest, PameldingRequest } from './data/pamelding-request.ts'
import { PameldingResponse, pameldingSchema } from './data/pamelding.ts'
import { SendInnPameldingRequest } from './data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from './data/send-inn-pamelding-uten-godkjenning-request.ts'

export const ERROR_PERSONIDENT =
  'Deltakelsen kunen ikke hentes fordi den tilhører en annen person enn den som er i kontekst.'

export const createPamelding = async (
  personident: string,
  deltakerlisteId: string,
  enhetId: string
): Promise<PameldingResponse> => {
  const request: PameldingRequest = {
    personident: personident,
    deltakerlisteId: deltakerlisteId
  }

  return fetch(`${API_URL}/pamelding`, {
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
          `Deltakelse kunne ikke hentes / opprettes for deltakerlisteId: ${deltakerlisteId}`,
          response.status
        )
        throw new Error(
          'Deltakelse kunne ikke hentes / opprettes. Prøv igjen senere'
        )
      }
      return response.json()
    })
    .then(parsePamelding)
}

export const getPamelding = async (
  deltakerId: string,
  personident: string,
  enhetId: string
): Promise<PameldingResponse> => {
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

export const deletePamelding = (deltakerId: string): Promise<number> => {
  return fetch(`${API_URL}/pamelding/${deltakerId}`, {
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

export const sendInnPamelding = async (
  deltakerId: string,
  enhetId: string,
  request: SendInnPameldingRequest
): Promise<PameldingResponse> => {
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
  request: SendInnPameldingUtenGodkjenningRequest
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
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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

export const endreDeltakelseSluttdato = (
  deltakerId: string,
  enhetId: string,
  request: EndreSluttdatoRequest
): Promise<PameldingResponse> => {
  return fetch(`${API_URL}/deltaker/${deltakerId}/sluttdato`, {
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
        const message = 'Kunne ikke endre sluttdato.'
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
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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

export const endreDeltakelseBakgrunnsinfo = (
  deltakerId: string,
  enhetId: string,
  request: EndreBakgrunnsinfoRequest
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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
): Promise<PameldingResponse> => {
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
  return fetch(`${API_URL}/pamelding/${deltakerId}/kladd`, {
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

const parsePamelding = (json: string): PameldingResponse => {
  try {
    return pameldingSchema.parse(json)
  } catch (error) {
    logError('Kunne ikke parse pameldingSchema:', error)
    throw new Error('Kunne ikke laste inn påmeldingen. Prøv igjen senere')
  }
}

const handleError = (
  message: string,
  deltakerId: string,
  responseStatus: number
) => {
  logError(`${message} DeltakerId: ${deltakerId}`, responseStatus)
  throw new Error(`${message} Prøv igjen senere.`)
}
