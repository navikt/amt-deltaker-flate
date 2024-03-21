import { deltakerBffApiBasePath } from '../utils/environment-utils'
import { DeltakerResponse, deltakerSchema } from './data/deltaker'

const APP_NAME = 'amt-deltaker-innbyggers-flate'

export const getDeltakelse = async (deltakerId: string): Promise<DeltakerResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/innbygger/${deltakerId}`, {
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
        throw error
      }
    })
}

export const godkjennUtkast = async (deltakerId: string): Promise<DeltakerResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/innbygger/${deltakerId}/godkjenn-utkast`, {
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
        throw error
      }
    })
}
