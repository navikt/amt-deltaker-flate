import {PameldingRequest} from './data/pamelding-request.ts'
import {PameldingResponse, pameldingSchema} from './data/pamelding.ts'
import {SendInnPameldingRequest} from './data/send-inn-pamelding-request.ts'
import {SendInnPameldingUtenGodkjenningRequest} from './data/send-inn-pamelding-uten-godkjenning-request.ts'

export const createPamelding = (request: PameldingRequest): Promise<PameldingResponse> => {
  return fetch('/api/pamelding', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(request)
  })
    .then(response => response.json())
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

