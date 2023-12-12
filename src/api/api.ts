import {PameldingRequest} from './data/pamelding-request.ts'
import {PameldingResponse, pameldingSchema} from './data/pamelding.ts'
import {SendInnPameldingRequest} from './data/send-inn-pamelding-request.ts'
import {SendInnPameldingUtenGodkjenningRequest} from './data/send-inn-pamelding-uten-godkjenning-request.ts'
import {apiUrl} from '../utils/environment-utils.ts'

export const checkBackend = async () => {
  return fetch(`${apiUrl()}internal/health/liveness`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText) // TODO Handle errors
      }

      return response.text()
    })
}

export const createPamelding = async (request: PameldingRequest): Promise<PameldingResponse> => {
  return fetch(`${apiUrl()}amt-deltaker-bff/deltaker`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(request)
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText) // TODO Handle errors
      }
      return response.json()
    })
    .then(json => pameldingSchema.parse(json))
}

export const deletePamelding = (deltakerId: string): Promise<number> => {
  return fetch(`/api/pamelding/${deltakerId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then(response => response.status)
}

export const sendInnPamelding = (deltakerId: string, request: SendInnPameldingRequest): Promise<number> => {
  return fetch(`/api/pamelding/${deltakerId}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(request)
  })
    .then(response => response.status)
}

export const sendInnPameldingUtenGodkjenning = (deltakerId: string, request: SendInnPameldingUtenGodkjenningRequest): Promise<number> => {
  return fetch(`/api/pamelding/${deltakerId}/utenGodkjenning`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(request)
  })
    .then(response => response.status)
}

