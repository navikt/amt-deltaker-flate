import { logError } from 'deltaker-flate-common'
import { ZodError } from 'zod'
import { API_URL } from '../utils/environment-utils'
import {
  Deltakere,
  deltakereSchema,
  DeltakerlisteDetaljer,
  deltakerlisteDetaljerSchema
} from './data/deltakerliste'

const APP_NAME = 'amt-deltakerliste-flate'

export const getDeltakerlisteDetaljer = async (
  deltakerlisteId: string
): Promise<DeltakerlisteDetaljer> => {
  return fetch(`${API_URL}/deltakerliste/${deltakerlisteId}`, {
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

export const getDeltakere = async (
  deltakerlisteId: string
): Promise<Deltakere> => {
  return fetch(`${API_URL}/deltakerliste/${deltakerlisteId}/deltakere`, {
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
        const message = 'Deltakere kunne ikke hentes.'
        handleError(message, deltakerlisteId, response.status)
      }
      return response.json()
    })
    .then((json: string) => {
      try {
        return deltakereSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakereSchema:', error)
        if (error instanceof ZodError) {
          logError('Issue', error.issues)
        }
        throw new Error('Kunne ikke laste inn deltakere. Prøv igjen senere')
      }
    })
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
