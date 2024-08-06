import {
  DeltakerHistorikkListe,
  deltakerHistorikkListeSchema
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
        throw new Error('Deltakelse kunne ikke hentes. Prøv igjen senere')
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse deltakerSchema:', error)
        if (error instanceof ZodError) {
          console.error('Issue', error.issues)
        }
        throw error
      }
    })
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
        throw new Error('Kunne ikke godkjenne utkastet. Prøv igjen senere')
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse deltakerSchema:', error)
        if (error instanceof ZodError) {
          console.error('Issue', error.issues)
        }
        throw error
      }
    })
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
        throw new Error('Endringer kunne ikke hentes. Prøv igjen senere')
      }
      return response.json()
    })
    .then((json) => {
      try {
        return deltakerHistorikkListeSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse deltakerHistorikkListeSchema:', error)
        if (error instanceof ZodError) {
          console.error('Issue', error.issues)
        }
        throw error
      }
    })
}
