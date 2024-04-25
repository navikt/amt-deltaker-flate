import { PameldingResponse } from '../api/data/pamelding.ts'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import {
  InnholdDto,
  SendInnPameldingRequest
} from '../api/data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { DeltakelsesprosentValg } from './utils.ts'
import { INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'

export const generateInnholdFromResponse = (
  pamelding: PameldingResponse,
  valgteInnhold: string[],
  innholdAnnetBeskrivelse?: string | null
): InnholdDto[] => {
  if (pamelding?.deltakelsesinnhold === null) {
    return []
  }
  return pamelding?.deltakelsesinnhold?.innhold.flatMap((i) => {
    const valgtInnhold = valgteInnhold.find(
      (valgtInnhold) => i.innholdskode === valgtInnhold
    )
    if (valgtInnhold === undefined) return []

    return [
      {
        innholdskode: i.innholdskode,
        beskrivelse:
          i.innholdskode === INNHOLD_TYPE_ANNET
            ? innholdAnnetBeskrivelse || null
            : null
      }
    ]
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
    deltakelsesprosent:
      data.deltakelsesprosentValg === DeltakelsesprosentValg.JA
        ? 100
        : data.deltakelsesprosent,
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
