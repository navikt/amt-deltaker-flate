import { logError } from 'deltaker-flate-common'
import { ZodError } from 'zod'
import { API_URL } from '../utils/environment-utils'
import {
  Deltakere,
  deltakereSchema,
  DeltakerlisteDetaljer,
  deltakerlisteDetaljerSchema
} from './data/deltakerliste'

const APP_NAME = 'amt-tiltakskoordinator-flate'

function apiUrl(deltakerlisteId: string) {
  return `${API_URL}/tiltakskoordinator/deltakerliste/${deltakerlisteId}`
}

export const getDeltakerlisteDetaljer = async (
  deltakerlisteId: string
): Promise<DeltakerlisteDetaljer> => {
  return fetch(`${apiUrl(deltakerlisteId)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Detaljer om gjennomføringen kunne ikke hentes.'
        handleError(message, deltakerlisteId, response.status)
      }
      return response.json()
    })
    .then((json: string) => {
      try {
        return deltakerlisteDetaljerSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerlisteDetaljerSchema:', error)
        if (error instanceof ZodError) {
          logError('Issue', error.issues)
        }
        throw new Error(
          'Kunne ikke laste inn detaljer om gjennomføringen. Prøv igjen senere'
        )
      }
    })
}

export type TilgangsFeil =
  | 'FeilADGruppe'
  | 'IkkeTilgangTilDeltakerliste'
  | 'DeltakerlisteStengt'
export type DeltakereResponse = Deltakere | TilgangsFeil

export const getDeltakere = async (
  deltakerlisteId: string
): Promise<DeltakereResponse> => {
  return fetch(`${apiUrl(deltakerlisteId)}/deltakere`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  }).then(async (response) => {
    if (response.status === 401) {
      return 'FeilADGruppe'
    }
    if (response.status === 403) {
      return 'IkkeTilgangTilDeltakerliste'
    }
    if (response.status === 410) {
      return 'DeltakerlisteStengt'
    }
    if (response.status !== 200) {
      const message = 'Deltakere kunne ikke hentes.'
      handleError(message, deltakerlisteId, response.status)
    }

    try {
      return deltakereSchema.parse(await response.json())
    } catch (error) {
      logError('Kunne ikke parse deltakereSchema:', error)
      if (error instanceof ZodError) {
        logError('Issue', error.issues)
      }
      throw new Error('Kunne ikke laste inn deltakere. Prøv igjen senere')
    }
  })
}

export async function leggTilTilgang(deltakerlisteId: string) {
  const response = await fetch(`${apiUrl(deltakerlisteId)}/tilgang/legg-til`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  })

  if (response.status !== 200) {
    const message = 'Tilgang kunne ikke legges til'
    handleError(message, deltakerlisteId, response.status)
  }
}

const handleError = (
  message: string,
  deltakerlisteId: string,
  responseStatus: number
) => {
  if (responseStatus !== 401) {
    // Ignorerer 401 da det er brukersesjonfeil
    logError(`${message} DeltakerlisteId: ${deltakerlisteId}`, responseStatus)
  }

  throw new Error(`${message} Prøv igjen senere.`)
}
