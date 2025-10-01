import {
  DeltakerHistorikkListe,
  deltakerHistorikkListeSchema,
  DeltakerStatusAarsak,
  logError
} from 'deltaker-flate-common'
import { API_URL } from '../utils/environment-utils'
import { DeltakerDetaljer, deltakerDetaljerSchema } from './data/deltaker.ts'
import {
  Deltaker,
  Deltakere,
  deltakereSchema,
  DeltakerlisteDetaljer,
  deltakerlisteDetaljerSchema,
  deltakerSchema
} from './data/deltakerliste'
import { ZodError } from 'zod'

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
        handleError(message, deltakerlisteId, response.status, null)
      }
      return response.json()
    })
    .then((json: string) => {
      try {
        return deltakerlisteDetaljerSchema.parse(json)
      } catch (error) {
        if (error instanceof ZodError) {
          logError('ZodError', error.issues)
        } else {
          logError(
            'Kunne ikke parse deltakerlisteDetaljerSchema for getDeltakerlisteDetaljer',
            deltakerlisteId
          )
        }

        throw new Error(
          'Kunne ikke laste inn detaljer om gjennomføringen. Prøv igjen senere'
        )
      }
    })
}

export enum TilgangsFeil {
  ManglerADGruppe = 'ManglerADGruppe',
  IkkeTilgangTilDeltakerliste = 'IkkeTilgangTilDeltakerliste',
  DeltakerlisteStengt = 'DeltakerlisteStengt'
}

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
    if (harTilgansfeil(response)) {
      return handleTilgangsfeil(response)
    }
    if (response.status !== 200) {
      const message = 'Deltakere kunne ikke hentes.'
      handleError(message, deltakerlisteId, response.status, null)
    }
    try {
      return deltakereSchema.parse(await response.json())
    } catch (error) {
      if (error instanceof ZodError) {
        logError('ZodError', error.issues)
      } else {
        logError(
          'Kunne ikke parse deltakereSchema for getDeltakere',
          deltakerlisteId
        )
      }

      throw new Error('Kunne ikke laste inn deltakere. Prøv igjen senere')
    }
  })
}

export type DeltakerResponse = DeltakerDetaljer | TilgangsFeil

export const getDeltaker = async (
  deltakerId: string
): Promise<DeltakerResponse> => {
  return fetch(`${API_URL}/tiltakskoordinator/deltaker/${deltakerId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  })
    .then((response) => {
      if (harTilgansfeil(response)) {
        return handleTilgangsfeil(response)
      }
      if (response.status !== 200) {
        const message = 'Deltaker detaljer kunne ikke hentes.'
        handleError(message, null, response.status, deltakerId)
      }
      return response.json()
    })
    .then((json: string) => {
      try {
        return deltakerDetaljerSchema.parse(json)
      } catch (error) {
        if (error instanceof ZodError) {
          logError('ZodError', error.issues)
        } else {
          logError(
            'Kunne ikke parse deltakerlisteDetaljerSchema for getDeltaker',
            deltakerId
          )
        }

        throw new Error(
          'Kunne ikke laste inn detaljer om deltaker. Prøv igjen senere'
        )
      }
    })
}

export const getDeltakerHistorikk = async (
  deltakerId: string
): Promise<DeltakerHistorikkListe> => {
  return fetch(
    `${API_URL}/tiltakskoordinator/deltaker/${deltakerId}/historikk`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Nav-Consumer-Id': APP_NAME
      }
    }
  )
    .then((response) => {
      if (response.status !== 200) {
        const message = 'Deltaker historikk kunne ikke hentes.'
        handleError(message, null, response.status, deltakerId)
      }
      return response.json()
    })
    .then((json: string) => {
      try {
        return deltakerHistorikkListeSchema.parse(json)
      } catch (error) {
        logError('Kunne ikke parse deltakerHistorikkListeSchema:', error)
        if (error instanceof ZodError) {
          logError('Issue', error.issues)
        }
        throw new Error(
          'Kunne ikke laste inn endringene for deltakelsen. Prøv igjen senere.'
        )
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
    handleError(message, deltakerlisteId, response.status, null)
  }
}

export async function fjernTilgang(deltakerlisteId: string) {
  const response = await fetch(`${apiUrl(deltakerlisteId)}/tilgang/fjern`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  })

  if (response.status !== 200) {
    const message = 'Tilgang kunne ikke fjernes'
    handleError(message, deltakerlisteId, response.status, null)
  }
}

export async function delDeltakereMedArrangor(
  deltakerlisteId: string,
  deltakerIder: string[]
): Promise<Deltakere> {
  return fetch(`${apiUrl(deltakerlisteId)}/deltakere/del-med-arrangor`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(deltakerIder),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  }).then(async (response) => {
    if (response.status !== 200) {
      const message = 'Deltakere kunne ikke deles med arrangør'
      handleError(message, deltakerlisteId, response.status, null)
    }
    try {
      return deltakereSchema.parse(await response.json())
    } catch (error) {
      if (error instanceof ZodError) {
        logError('ZodError', error.issues)
      } else {
        logError(
          'Kunne ikke parse deltakereSchema for delDeltakereMedArrangor',
          deltakerlisteId
        )
      }

      throw new Error(
        'Deltakerne ble delt med arrangør, men vi kunne ikke laste inn deltakerne på nytt. Prøv igjen senere.'
      )
    }
  })
}

export async function tildelPlass(
  deltakerlisteId: string,
  deltakerIder: string[]
): Promise<Deltakere> {
  return fetch(`${apiUrl(deltakerlisteId)}/deltakere/tildel-plass`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(deltakerIder),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  }).then(async (response) => {
    if (response.status !== 200) {
      const message = 'Deltakere kunne tildeles plass'
      handleError(message, deltakerlisteId, response.status, null)
    }
    try {
      return deltakereSchema.parse(await response.json())
    } catch (error) {
      if (error instanceof ZodError) {
        logError('ZodError', error.issues)
      } else {
        logError(
          'Kunne ikke parse deltakereSchema for tildelPlass',
          deltakerlisteId
        )
      }

      throw new Error(
        'Deltakerne ble tildelt plass, men vi kunne ikke laste inn deltakerne på nytt. Prøv igjen senere.'
      )
    }
  })
}

export async function settDeltakerePaVenteliste(
  deltakerlisteId: string,
  deltakerIder: string[]
): Promise<Deltakere> {
  return fetch(`${apiUrl(deltakerlisteId)}/deltakere/sett-paa-venteliste`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(deltakerIder),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  }).then(async (response) => {
    if (response.status !== 200) {
      const message = 'Deltakere kunne ikke settes på venteliste'
      handleError(message, deltakerlisteId, response.status, null)
    }
    try {
      return deltakereSchema.parse(await response.json())
    } catch (error) {
      if (error instanceof ZodError) {
        logError('ZodError', error.issues)
      } else {
        logError(
          'Kunne ikke parse deltakereSchema for settDeltakerePaVenteliste',
          deltakerlisteId
        )
      }

      throw new Error(
        'Deltakerne ble satt på venteliste, men vi kunne ikke laste inn deltakerne på nytt. Prøv igjen senere.'
      )
    }
  })
}

export async function giAvslag(
  deltakerlisteId: string,
  deltakerId: string,
  aarsak: DeltakerStatusAarsak,
  begrunnelse: string | null
): Promise<Deltaker> {
  return fetch(`${apiUrl(deltakerlisteId)}/deltakere/gi-avslag`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      deltakerId,
      aarsak,
      begrunnelse
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Nav-Consumer-Id': APP_NAME
    }
  }).then(async (response) => {
    if (response.status !== 200) {
      const message = 'Kunne ikke gi avslag til deltaker'
      handleError(message, deltakerlisteId, response.status, null)
    }
    try {
      return deltakerSchema.parse(await response.json())
    } catch (error) {
      if (error instanceof ZodError) {
        logError('ZodError', error.issues)
      } else {
        logError(
          'Kunne ikke parse deltakerSchema for giAvslag',
          deltakerlisteId
        )
      }

      throw new Error(
        'Deltakern fikk avslag, men vi kunne ikke laste inn deltakerne på nytt. Prøv igjen senere.'
      )
    }
  })
}

export async function markerSomLest(ulestHendelseId: string): Promise<void> {
  return fetch(
    `${API_URL}/tiltakskoordinator/ulest-hendelse/${ulestHendelseId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Nav-Consumer-Id': APP_NAME
      }
    }
  ).then(async (response) => {
    if (response.status !== 204) {
      const message = `Kunne ikke markere ulest hendelse som lest: ${ulestHendelseId}`
      logError(message)
      throw new Error(message)
    }
    return Promise.resolve()
  })
}

const harTilgansfeil = (response: Response) => {
  return [401, 403, 410].includes(response.status)
}

const handleTilgangsfeil = (response: Response): TilgangsFeil => {
  if (response.status === 401) {
    return TilgangsFeil.ManglerADGruppe
  }
  if (response.status === 403) {
    return TilgangsFeil.IkkeTilgangTilDeltakerliste
  }
  if (response.status === 410) {
    return TilgangsFeil.DeltakerlisteStengt
  }
  throw new Error('Ukjent tilgangsfeil')
}

const handleError = (
  message: string,
  deltakerlisteId: string | null,
  responseStatus: number,
  deltakerId: string | null
) => {
  // Ignorerer 401 da det er brukersesjonfeil
  if (responseStatus !== 401) {
    const deltakerlisteIdString = deltakerlisteId
      ? `DeltakerlisteId: ${deltakerlisteId}`
      : ''
    const deltakerIdString = deltakerId ? `deltakerId ${deltakerId}` : ''
    logError(
      `${message} ${deltakerlisteIdString} ${deltakerIdString}`,
      responseStatus
    )
  }

  throw new Error(`${message} Prøv igjen senere.`)
}
