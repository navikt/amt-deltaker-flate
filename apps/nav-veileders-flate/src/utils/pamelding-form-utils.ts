import { INNHOLD_TYPE_ANNET, visDeltakelsesmengde } from 'deltaker-flate-common'
import { PameldingResponse } from '../api/data/pamelding.ts'
import {
  InnholdDto,
  SendInnPameldingRequest
} from '../api/data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import { DeltakelsesprosentValg } from './utils.ts'

export const generateInnholdFromResponse = (
  pamelding: PameldingResponse,
  valgteInnhold: string[],
  innholdAnnetBeskrivelse?: string | null
): InnholdDto[] => {
  if (pamelding === null) {
    return []
  }

  return pamelding.deltakerliste.tilgjengeligInnhold.innhold.flatMap((i) => {
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

const getDeltakerProsent = (
  pamelding: PameldingResponse,
  data: PameldingFormValues
) => {
  const harDeltakelsesmengde = visDeltakelsesmengde(
    pamelding.deltakerliste.tiltakstype
  )
  const deltakelsesprosen =
    data.deltakelsesprosentValg === DeltakelsesprosentValg.JA
      ? 100
      : data.deltakelsesprosent
  return harDeltakelsesmengde ? deltakelsesprosen : undefined
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
    deltakelsesprosent: getDeltakerProsent(pamelding, data),
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
    deltakelsesprosent: getDeltakerProsent(pamelding, data),
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    innhold: generateInnholdFromResponse(
      pamelding,
      data.valgteInnhold,
      data.innholdAnnetBeskrivelse
    )
  }
}
