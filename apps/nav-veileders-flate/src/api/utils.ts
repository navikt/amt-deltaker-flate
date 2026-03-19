import { logError } from 'deltaker-flate-common'
import { DeltakerResponse, pameldingSchema } from './data/pamelding'

export const DELTAKER_FOR_UNG_ERROR = 'DELTAKER_FOR_UNG'
export const ERROR_PERSONIDENT =
  'Deltakelsen kunen ikke hentes fordi den tilhører en annen person enn den som er i kontekst.'

export const parsePamelding = (json: string): DeltakerResponse => {
  try {
    return pameldingSchema.parse(json)
  } catch (error) {
    logError('Kunne ikke parse pameldingSchema:', error)
    throw new Error('Kunne ikke laste inn påmeldingen. Prøv igjen senere')
  }
}

export const handleError = (
  message: string,
  deltakerId: string,
  responseStatus: number
) => {
  logError(`${message} DeltakerId: ${deltakerId}`, responseStatus)
  throw new Error(`${message} Prøv igjen senere.`)
}
