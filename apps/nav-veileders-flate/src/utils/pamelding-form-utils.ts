import {
  erOpplaringstiltak,
  INNHOLD_TYPE_ANNET,
  Tiltakskode,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { KladdRequest } from '../api/data/kladd-request.ts'
import { DeltakerResponse } from '../api/data/pamelding.ts'
import { InnholdDto, PameldingRequest } from '../api/data/send-pamelding.ts'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import { DeltakelsesprosentValg } from './utils.ts'

export const generateInnholdForRequest = (
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
    const erInnholdValgt = valgteInnhold.find(
      (valgtInnhold) => i.innholdskode === valgtInnhold
    )
    if (erInnholdValgt === undefined) return []

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
): PameldingRequest => {
  if (!data) {
    throw new Error('data should not be undefined')
  }

  return {
    deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
    dagerPerUke: data.dagerPerUke,
    deltakelsesprosent: getDeltakerProsent(pamelding, data),
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    innhold: generateInnholdForRequest(
      pamelding,
      data.valgteInnhold,
      data.innholdAnnetBeskrivelse,
      data.innholdsTekst
    )
  }
}

export const formToKladdRequest = (
  pamelding: DeltakerResponse,
  data: PameldingFormValues
): KladdRequest => {
  return {
    innhold: generateInnholdForRequest(
      pamelding,
      data.valgteInnhold,
      data.innholdAnnetBeskrivelse,
      data.innholdsTekst
    ),
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    deltakelsesprosent: data.deltakelsesprosent,
    dagerPerUke: data.dagerPerUke
  }
}

export const generatePameldingRequest = (
  pamelding: DeltakerResponse
): PameldingRequest => {
  return {
    deltakerlisteId: pamelding.deltakerliste.deltakerlisteId,
    dagerPerUke: pamelding.dagerPerUke || undefined,
    deltakelsesprosent: pamelding.deltakelsesprosent || undefined,
    bakgrunnsinformasjon: pamelding.bakgrunnsinformasjon || undefined,
    innhold:
      pamelding.deltakelsesinnhold?.innhold
        .filter((i) => i.valgt)
        .map((i) => ({
          innholdskode: i.innholdskode,
          beskrivelse: i.beskrivelse
        })) || []
  }
}
