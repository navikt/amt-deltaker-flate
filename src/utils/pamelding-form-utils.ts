import { Innhold, PameldingResponse } from '../api/data/pamelding.ts'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import { SendInnPameldingRequest } from '../api/data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { INNHOLD_TYPE_ANNET } from './utils.ts'

export const generateInnholdFromResponse = (
  pamelding: PameldingResponse,
  valgteInnhold: string[],
  innholdAnnetBeskrivelse?: string | null
): Innhold[] => {
  return pamelding.innhold.map((i) => {
    const erInnholdValgt = !!valgteInnhold.find((valgtInnhold) => i.type === valgtInnhold)
    const erInnholdAnnet = i.type === INNHOLD_TYPE_ANNET

    return {
      type: i.type,
      visningstekst: i.visningstekst,
      beskrivelse: erInnholdAnnet && erInnholdValgt ? innholdAnnetBeskrivelse || null : null,
      valgt: erInnholdValgt
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
    innhold: generateInnholdFromResponse(
      pamelding,
      data.valgteInnhold,
      data.innholdAnnetBeskrivelse
    )
  }
}

export const generateDirektePameldingRequestForm = (
  pamelding: PameldingResponse,
  data: PameldingFormValues | undefined
): SendInnPameldingUtenGodkjenningRequest => {
  if (!data) {
    throw new Error('data should not be undefined')
  }
  return {
    deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
    dagerPerUke: data.dagerPerUke,
    deltakelsesprosent: data.deltakelsesprosent,
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    innhold: generateInnholdFromResponse(
      pamelding,
      data.valgteInnhold,
      data.innholdAnnetBeskrivelse
    )
  }
}
