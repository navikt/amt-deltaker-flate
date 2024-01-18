import {Mal, PameldingResponse} from '../api/data/pamelding.ts'
import {PameldingFormValues} from '../model/PameldingFormValues.ts'
import {SendInnPameldingRequest} from '../api/data/send-inn-pamelding-request.ts'

const generateMalFromResponse = (pamelding: PameldingResponse, selectedMal: string[]): Mal[] => {
  return pamelding.mal.map((mal) => {
    return {
      type: mal.type,
      visningstekst: mal.visningstekst,
      beskrivelse: mal.beskrivelse,
      valgt: selectedMal.find((i) => i === mal.type) !== undefined
    }
  })
}

export const generatePameldingRequestFromForm = (pamelding: PameldingResponse, data: PameldingFormValues | undefined): SendInnPameldingRequest => {
  if (!data) {
    throw new Error('data should not be undefined')
  }

  return {
    deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
    dagerPerUke: data.dagerPerUke,
    deltakelsesprosent: data.deltakelsesprosent,
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    mal: generateMalFromResponse(pamelding, data.valgteMal)
  }
}
