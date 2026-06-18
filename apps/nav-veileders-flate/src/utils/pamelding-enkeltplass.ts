import dayjs from 'dayjs'
import {
  INNHOLD_TYPE_ANNET,
  Prisinformasjon,
  PrisinformasjonType,
  Tilskuddstype
} from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import { dateToIsoString, formatDateToDtoStr } from './utils'
import {
  EnkeltplassKladdRequest,
  PrisinformasjonKladd
} from '../api/data/kladd-request'

const formToEnkeltplassData = (data: PameldingEnkeltplassFormValues) => {
  const startdatoParsed = dayjs(data.startdato, DATE_FORMAT, true)
  const sluttdatoParsed = dayjs(data.sluttdato, DATE_FORMAT, true)
  const startdato = startdatoParsed.isValid()
    ? formatDateToDtoStr(startdatoParsed.toDate())
    : undefined
  const sluttdato = sluttdatoParsed.isValid()
    ? formatDateToDtoStr(sluttdatoParsed.toDate())
    : undefined

  return {
    beskrivelse: data.innhold,
    startdato,
    sluttdato,
    prisinformasjon: formatPrisinformasjonTilRequest(data.prisinformasjon),
    arrangorUnderenhet: data.arrangorUnderenhet,
    kodeverkValg: data.kodeverkValg.flatMap((kv) => kv.valgteIder),
    sertifiseringValg: data.sertifiseringValg
  }
}

const formatPrisinformasjonTilRequest = (
  prisinformasjon:
    | Prisinformasjon
    | PameldingEnkeltplassFormValues['prisinformasjon']
): PrisinformasjonKladd | null => {
  if (!prisinformasjon) {
    return null
  }

  if (prisinformasjon.type === PrisinformasjonType.Anskaffelse) {
    return {
      type: PrisinformasjonType.Anskaffelse,
      pris: prisinformasjon.pris
    }
  }

  if (prisinformasjon.type === PrisinformasjonType.Tilskudd) {
    const tilskudd: Partial<Record<Tilskuddstype, number>> = {}
    prisinformasjon.tilskudd.forEach((tilskuddValg) => {
      tilskudd[tilskuddValg.tilskudd] = tilskuddValg.belop
    })

    return {
      type: PrisinformasjonType.Tilskudd,
      tilskudd,
      tilleggsopplysninger: prisinformasjon.tilleggsopplysninger
    }
  }

  if (prisinformasjon.type === PrisinformasjonType.IngenKostnader) {
    return {
      type: PrisinformasjonType.IngenKostnader,
      aarsak: prisinformasjon.aarsak,
      tilleggsopplysninger: prisinformasjon.tilleggsopplysninger
    }
  }

  return null
}

export const formToEnkeltplassKladdRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassKladdRequest => {
  return formToEnkeltplassData(data)
}

export const formToEnkeltplassRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassPameldingRequest => {
  const { startdato, sluttdato, ...rest } = formToEnkeltplassData(data)
  const prisinformasjon = formatPrisinformasjonTilRequest(data.prisinformasjon)

  // TODO kan iv forhindre dette? formet validerer så det blir riktig
  if (!prisinformasjon) {
    throw new Error(
      'Prisinformasjon er påkrevd for EnkeltplassPameldingRequest'
    )
  }

  return {
    ...rest,
    startdato: startdato ?? '',
    sluttdato: sluttdato ?? '',
    prisinformasjon
  }
}

export const generateEnkeltplassPameldingRequest = (
  deltaker: DeltakerResponse
): EnkeltplassPameldingRequest => {
  const prisinformasjon = formatPrisinformasjonTilRequest(
    deltaker.deltakerliste.prisinformasjon
  )

  if (!prisinformasjon) {
    // TODO kan iv forhindre dette? formet validerer så det blir riktig
    throw new Error(
      'Prisinformasjon er påkrevd for EnkeltplassPameldingRequest'
    )
  }
  return {
    beskrivelse:
      deltaker.deltakelsesinnhold?.innhold.find(
        (i) => i.innholdskode === INNHOLD_TYPE_ANNET
      )?.beskrivelse || '',
    prisinformasjon,
    startdato: dateToIsoString(deltaker.startdato),
    sluttdato: dateToIsoString(deltaker.sluttdato),
    arrangorUnderenhet:
      deltaker.deltakerliste.arrangor?.organisasjonsnummer || '',
    kodeverkValg:
      deltaker.deltakerliste.kodeverk?.valgteKategoriseringer.flatMap(
        (kodeverk) => kodeverk.valg.map((v) => v.id)
      ),
    sertifiseringValg: deltaker.deltakerliste.kodeverk?.valgteSertifiseringer
  }
}

/**
 * Sjekker om pameldingen er en enkeltplass uten rammeavtale
 */
export const erEnkeltPlass = (pamelding: DeltakerResponse) => {
  return pamelding.deltakerliste.erEnkeltplass
}
