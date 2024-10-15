import {
  DeltakerHistorikkListe,
  deltakerHistorikkListeSchema,
  logError
} from 'deltaker-flate-common'
import { ZodError } from 'zod'
import { API_URL } from '../utils/environment-utils'
import { DeltakerResponse, deltakerSchema } from './data/deltaker'

const APP_NAME = 'amt-deltaker-innbyggers-flate'

export const getDeltakelse = async (
  deltakerId: string
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/innbygger/${deltakerId}`, {
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
        const message = 'Deltakelse kunne ikke hentes.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parseDeltakelse)
}

export const godkjennUtkast = async (
  deltakerId: string
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/innbygger/${deltakerId}/godkjenn-utkast`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  })
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Kunne ikke godkjenne utkastet.'
        handleError(message, deltakerId, response.status)
      }
      return response.json()
    })
    .then(parseDeltakelse)
}

export const getHistorikk = async (
  deltakerId: string
): Promise<DeltakerHistorikkListe> => {
  return fetch(`${API_URL}/innbygger/${deltakerId}/historikk`, {
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
        throw new Error(
          'Kunne ikke laste inn endringene for deltakelsen. Prøv igjen senere'
        )
      }
    })
}

const parseDeltakelse = (json: string): DeltakerResponse => {
  try {
    return deltakerSchema.parse(json)
  } catch (error) {
    logError('Kunne ikke parse deltakerSchema:', error)
    if (error instanceof ZodError) {
      logError('Issue', error.issues)
    }
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
