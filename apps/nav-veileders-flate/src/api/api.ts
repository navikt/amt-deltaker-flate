import { PameldingRequest } from './data/pamelding-request.ts'
import { PameldingResponse, pameldingSchema } from './data/pamelding.ts'
import { SendInnPameldingRequest } from './data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from './data/send-inn-pamelding-uten-godkjenning-request.ts'
import { deltakerBffApiBasePath } from '../utils/environment-utils.ts'
import {
  AvsluttDeltakelseRequest,
  EndreBakgrunnsinfoRequest,
  EndreDeltakelsesmengdeRequest,
  EndreInnholdRequest,
  EndreSluttarsakRequest,
  EndreSluttdatoRequest,
  EndreStartdatoRequest,
  ForlengDeltakelseRequest,
  IkkeAktuellRequest
} from './data/endre-deltakelse-request.ts'
import { KladdRequest } from './data/kladd-request.ts'

export const createPamelding = async (
  personident: string,
  deltakerlisteId: string,
  enhetId: string
): Promise<PameldingResponse> => {
  const request: PameldingRequest = {
    personident: personident,
    deltakerlisteId: deltakerlisteId
  }

  return fetch(`${deltakerBffApiBasePath()}/pamelding`, {
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
        throw new Error(
          'Deltakelse kunne ikke hentes / opprettes. Prøv igjen senere'
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const getPamelding = async (
  deltakerId: string
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/deltaker/${deltakerId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
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
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const deletePamelding = (deltakerId: string): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then((response) => response.status)
}

export const sendInnPamelding = async (
  deltakerId: string,
  enhetId: string,
  request: SendInnPameldingRequest
): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}`, {
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
      throw new Error(
        `Påmeldingen kunne ikke sendes inn. Prøv igjen senere. (${response.status})`
      )
    }

    return response.status
  })
}

export const sendInnPameldingUtenGodkjenning = (
  deltakerId: string,
  enhetId: string,
  request: SendInnPameldingUtenGodkjenningRequest
): Promise<number> => {
  return fetch(
    `${deltakerBffApiBasePath()}/pamelding/${deltakerId}/utenGodkjenning`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'aktiv-enhet': enhetId
      },
      body: JSON.stringify(request)
    }
  ).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        `Påmeldingen kunne ikke sendes inn. Prøv igjen senere. (${response.status})`
      )
    }

    return response.status
  })
}

export const endreDeltakelseIkkeAktuell = (
  deltakerId: string,
  enhetId: string,
  request: IkkeAktuellRequest
): Promise<PameldingResponse> => {
  return fetch(
    `${deltakerBffApiBasePath()}/deltaker/${deltakerId}/ikke-aktuell`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'aktiv-enhet': enhetId
      },
      body: JSON.stringify(request)
    }
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke utføre endringen å sette til ikke aktuell. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const endreDeltakelseForleng = (
  deltakerId: string,
  enhetId: string,
  request: ForlengDeltakelseRequest
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/deltaker/${deltakerId}/forleng`, {
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
        throw new Error(
          `Kunne ikke forlenge deltakelsen. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const endreDeltakelseStartdato = (
  deltakerId: string,
  enhetId: string,
  request: EndreStartdatoRequest
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/deltaker/${deltakerId}/startdato`, {
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
        throw new Error(
          `Kunne ikke endre oppstartsdato. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const endreDeltakelseSluttdato = (
  deltakerId: string,
  enhetId: string,
  request: EndreSluttdatoRequest
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/deltaker/${deltakerId}/sluttdato`, {
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
        throw new Error(
          `Kunne ikke endre sluttdato. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const endreDeltakelseSluttarsak = (
  deltakerId: string,
  enhetId: string,
  request: EndreSluttarsakRequest
): Promise<PameldingResponse> => {
  return fetch(
    `${deltakerBffApiBasePath()}/deltaker/${deltakerId}/sluttarsak`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'aktiv-enhet': enhetId
      },
      body: JSON.stringify(request)
    }
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre sluttårsak. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const avsluttDeltakelse = (
  deltakerId: string,
  enhetId: string,
  request: AvsluttDeltakelseRequest
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/deltaker/${deltakerId}/avslutt`, {
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
        throw new Error(
          `Kunne ikke avslutte deltakelse. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const endreDeltakelseBakgrunnsinfo = (
  deltakerId: string,
  enhetId: string,
  request: EndreBakgrunnsinfoRequest
): Promise<PameldingResponse> => {
  return fetch(
    `${deltakerBffApiBasePath()}/deltaker/${deltakerId}/bakgrunnsinformasjon`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'aktiv-enhet': enhetId
      },
      body: JSON.stringify(request)
    }
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre bakgrunnsinfo. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      return pameldingSchema.parse(json)
    })
}

export const endreDeltakelseInnhold = (
  deltakerId: string,
  enhetId: string,
  request: EndreInnholdRequest
): Promise<PameldingResponse> => {
  return fetch(`${deltakerBffApiBasePath()}/deltaker/${deltakerId}/innhold`, {
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
        throw new Error(
          `Kunne ikke endre innhold. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const endreDeltakelsesmengde = (
  deltakerId: string,
  enhetId: string,
  request: EndreDeltakelsesmengdeRequest
): Promise<PameldingResponse> => {
  return fetch(
    `${deltakerBffApiBasePath()}/deltaker/${deltakerId}/deltakelsesmengde`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'aktiv-enhet': enhetId
      },
      body: JSON.stringify(request)
    }
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Kunne ikke endre deltakelsesmengde. Prøv igjen senere. (${response.status})`
        )
      }
      return response.json()
    })
    .then((json) => {
      try {
        return pameldingSchema.parse(json)
      } catch (error) {
        console.error('Kunne ikke parse pameldingSchema:', error)
        throw error
      }
    })
}

export const avbrytUtkast = (
  deltakerId: string,
  enhetId: string
): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}/avbryt`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'aktiv-enhet': enhetId
    }
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        `Kunne ikke avbryte utkastet. Prøv igjen senere. (${response.status})`
      )
    }
    return response.status
  })
}

export const oppdaterKladd = async (
  deltakerId: string,
  enhetId: string,
  request: KladdRequest
): Promise<number> => {
  return fetch(`${deltakerBffApiBasePath()}/pamelding/${deltakerId}/kladd`, {
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
      throw new Error(
        `Kunne ikke lagre kladd. Prøv igjen senere. (${response.status})`
      )
    }
    return response.status
  })
}
