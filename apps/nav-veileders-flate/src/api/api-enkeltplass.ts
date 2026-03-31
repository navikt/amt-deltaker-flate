import { logError, Tiltakskode } from 'deltaker-flate-common'
import { API_URL } from '../utils/environment-utils'
import { EnkeltplassPameldingRequest } from './data/enkeltplass-pamelding'
import {
  EnkeltplassKladdRequest,
  OpprettEnkeltplassKladdRequest
} from './data/kladd-request'
import { DeltakerResponse } from './data/pamelding'
import { DELTAKER_FOR_UNG_ERROR, handleError, parsePamelding } from './utils'

export const opprettEnkeltplassKladd = async (
  personident: string,
  tiltakskode: Tiltakskode,
  enhetId: string
): Promise<DeltakerResponse> => {
  const request: OpprettEnkeltplassKladdRequest = {
    personident: personident,
    tiltakskode: tiltakskode
  }

  return fetch(`${API_URL}/opprett-enkeltplass-kladd`, {
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
          `Deltakelse kunne ikke hentes / opprettes for tiltakskode: ${tiltakskode}`,
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

export const oppdaterKladd = async (
  deltakerId: string,
  enhetId: string,
  request: EnkeltplassKladdRequest
): Promise<number> => {
  return fetch(`${API_URL}/oppdater-enkeltplass-kladd/${deltakerId}`, {
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

export const oppdaterUtkast = async (
  deltakerId: string,
  enhetId: string,
  request: EnkeltplassPameldingRequest
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/enkeltplass-utkast/${deltakerId}`, {
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

export const meldPaDirekteEnkeltplass = (
  deltakerId: string,
  enhetId: string,
  request: EnkeltplassPameldingRequest
): Promise<number> => {
  return fetch(`${API_URL}/enkeltplass-utkast/${deltakerId}/meld-paa-direkte`, {
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
