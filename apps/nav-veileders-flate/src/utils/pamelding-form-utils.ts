import {
  erOpplaringstiltak,
  INNHOLD_TYPE_ANNET,
  Tiltakskode,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/pamelding.ts'
import { InnholdDto, UtkastRequest } from '../api/data/utkast-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import { DeltakelsesprosentValg } from './utils.ts'

export const generateInnholdFromResponse = (
  pamelding: DeltakerResponse,
  valgteInnhold: string[],
  innholdAnnetBeskrivelse?: string | null,
  innholdsTekst?: string | null
): InnholdDto[] => {
  if (
    pamelding.deltakerliste.tiltakskode ===
      Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    erOpplaringstiltak(pamelding.deltakerliste.tiltakskode)
  ) {
    return innholdsTekst
      ? [
          {
            innholdskode: INNHOLD_TYPE_ANNET,
            beskrivelse: innholdsTekst
          }
        ]
      : []
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
  pamelding: DeltakerResponse,
  data: PameldingFormValues
) => {
  const harDeltakelsesmengde = visDeltakelsesmengde(
    pamelding.deltakerliste.tiltakskode
  )
  const deltakelsesprosen =
    data.deltakelsesprosentValg === DeltakelsesprosentValg.JA
      ? 100
      : data.deltakelsesprosent
  return harDeltakelsesmengde ? deltakelsesprosen : undefined
}

export const generatePameldingRequestFromForm = (
  pamelding: DeltakerResponse,
  data: PameldingFormValues | undefined
): UtkastRequest => {
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
      data.innholdAnnetBeskrivelse,
      data.innholdsTekst
    )
  }
}

export const generateDirektePameldingRequestForm = (
  pamelding: DeltakerResponse,
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
      data.innholdAnnetBeskrivelse,
      data.innholdsTekst
    )
  }
}
