import {
  erOpplaringstiltak,
  INNHOLD_TYPE_ANNET,
  Tiltakskode,
  harDeltakelsesmengde
} from 'deltaker-flate-common'
import { KladdRequest } from '../api/data/kladd-request.ts'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import { InnholdDto, PameldingRequest } from '../api/data/send-pamelding.ts'
import { PameldingFormValues } from '../model/PameldingFormValues.ts'
import { DeltakelsesprosentValg } from './utils.ts'

export const generateInnholdForRequest = (
  deltaker: DeltakerResponse,
  valgteInnhold: string[],
  innholdAnnetBeskrivelse?: string | null,
  innholdsTekst?: string | null
): InnholdDto[] => {
  if (
    deltaker.deltakerliste.tiltakskode ===
      Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    deltaker.deltakerliste.tiltakskode ===
      Tiltakskode.TILRETTELAGT_ARBEID_ORDINAER ||
    erOpplaringstiltak(deltaker.deltakerliste.tiltakskode)
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

  return deltaker.deltakerliste.tilgjengeligInnhold.innhold.flatMap((i) => {
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
  deltaker: DeltakerResponse,
  data: PameldingFormValues
) => {
  const deltakelsesprosen =
    data.deltakelsesprosentValg === DeltakelsesprosentValg.JA
      ? 100
      : data.deltakelsesprosent
  return harDeltakelsesmengde(
    deltaker.deltakerliste.tiltakskode,
    deltaker.deltakerliste.erEnkeltplass
  )
    ? deltakelsesprosen
    : undefined
}

export const generatePameldingRequestFromForm = (
  deltaker: DeltakerResponse,
  data: PameldingFormValues | undefined
): PameldingRequest => {
  if (!data) {
    throw new Error('data should not be undefined')
  }

  return {
    deltakerlisteId: deltaker.deltakerliste.deltakerlisteId,
    dagerPerUke: data.dagerPerUke,
    deltakelsesprosent: getDeltakerProsent(deltaker, data),
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    innhold: generateInnholdForRequest(
      deltaker,
      data.valgteInnhold,
      data.innholdAnnetBeskrivelse,
      data.innholdsTekst
    )
  }
}

export const formToKladdRequest = (
  deltaker: DeltakerResponse,
  data: PameldingFormValues
): KladdRequest => {
  return {
    innhold: generateInnholdForRequest(
      deltaker,
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
  deltaker: DeltakerResponse
): PameldingRequest => {
  return {
    deltakerlisteId: deltaker.deltakerliste.deltakerlisteId,
    dagerPerUke: deltaker.dagerPerUke || undefined,
    deltakelsesprosent: deltaker.deltakelsesprosent || undefined,
    bakgrunnsinformasjon: deltaker.bakgrunnsinformasjon || undefined,
    innhold:
      deltaker.deltakelsesinnhold?.innhold
        .filter((i) => i.valgt)
        .map((i) => ({
          innholdskode: i.innholdskode,
          beskrivelse: i.beskrivelse
        })) || []
  }
}
