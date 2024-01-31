import { Mal, PameldingResponse } from '../api/data/pamelding.ts'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import { SendInnPameldingRequest } from '../api/data/send-inn-pamelding-request.ts'
import {
  Begrunnelse,
  SendInnPameldingUtenGodkjenningRequest
} from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { MAL_TYPE_ANNET } from './utils.ts'

const generateMalFromResponse = (
  pamelding: PameldingResponse,
  valgteMal: string[],
  malAnnetBeskrivelse: string | null
): Mal[] => {
  return pamelding.mal.map((mal) => {
    const erMalValgt = !!valgteMal.find((valgtMal) => mal.type === valgtMal)
    const erMalAnnet = mal.type === MAL_TYPE_ANNET

    return {
      type: mal.type,
      visningstekst: mal.visningstekst,
      beskrivelse: erMalAnnet && erMalValgt ? malAnnetBeskrivelse : null,
      valgt: erMalValgt
    }
  })
}

export const generatePameldingRequestFromForm = (
  pamelding: PameldingResponse,
  data: PameldingFormValues | undefined
): SendInnPameldingRequest => {
  if (!data) {
    throw new Error('data should not be undefined')
  }

  return {
    deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
    dagerPerUke: data.dagerPerUke,
    deltakelsesprosent: data.deltakelsesprosent,
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    mal: generateMalFromResponse(pamelding, data.valgteMal, data.malAnnetBeskrivelse)
  }
}

export const generateDirektePameldingRequestForm = (
  pamelding: PameldingResponse,
  data: PameldingFormValues | undefined,
  begrunnelse: Begrunnelse
): SendInnPameldingUtenGodkjenningRequest => {
  if (!data) {
    throw new Error('data should not be undefined')
  }
  return {
    deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
    dagerPerUke: data.dagerPerUke,
    deltakelsesprosent: data.deltakelsesprosent,
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    mal: generateMalFromResponse(pamelding, data.valgteMal, data.malAnnetBeskrivelse),
    begrunnelse: begrunnelse
  }
}
