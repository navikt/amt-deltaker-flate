import {PameldingRequest} from './data/pamelding-request.ts'
import {PameldingResponse, pameldingSchema} from './data/pamelding.ts'
import {SendInnPameldingRequest} from './data/send-inn-pamelding-request.ts'
import {SendInnPameldingUtenGodkjenningRequest} from './data/send-inn-pamelding-uten-godkjenning-request.ts'
import {deltakerBffApiBasePath} from '../utils/environment-utils.ts'
import { IkkeAktuellRequest } from './data/endre-deltakelse-request.ts'
import { AvbrytUtkastRequest } from './data/avbryt-utkast-request.ts'

export const createPamelding = async (
  personident: string,
  deltakerlisteId: string,
  enhetId: string
): Promise<PameldingResponse> => {
  const request: PameldingRequest = {
    personident: personident,
    deltakerlisteId: deltakerlisteId
  }

  return fetch(`${deltakerBffApiBasePath()}/pamelding`, {
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
        throw new Error('Deltakelse kunne ikke hentes / opprettes. Prøv igjen senere')
      }
      return response.json()
    })
    .then((json) => pameldingSchema.parse(json))
}

export const deletePamelding = (deltakerId: string): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then((response) => response.status)
}

export const sendInnPamelding = async (
  deltakerId: string,
  enhetId: string,
  request: SendInnPameldingRequest
): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}`, {
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
      throw new Error(`Påmeldingen kunne ikke sendes inn. Prøv igjen senere. (${response.status})`)
    }

    return response.status
  })
}

export const sendInnPameldingUtenGodkjenning = (
  deltakerId: string,
  enhetId: string,
  request: SendInnPameldingUtenGodkjenningRequest
): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}/utenGodkjenning`, {
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
      throw new Error(`Påmeldingen kunne ikke sendes inn. Prøv igjen senere. (${response.status})`)
    }

    return response.status
  })
}

export const endreDeltakelseIkkeAktuell = (
  deltakerId: string,
  enhetId: string,
  request: IkkeAktuellRequest
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/deltaker/${deltakerId}/ikke-aktuell`, {
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
        throw new Error(
          `Kunne ikke utføre endringen å sette til ikke aktuell. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      return pameldingSchema.parse(json)
    })
}

export const avbrytUtkast = (
  deltakerId: string,
  enhetId: string,
  request: AvbrytUtkastRequest
): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}/avbryt`, {
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
        throw new Error(
          `Kunne ikke avbryte utkastet. Prøv igjen senere. (${response.status})`
        )
      }
      return response.status
    })
}

