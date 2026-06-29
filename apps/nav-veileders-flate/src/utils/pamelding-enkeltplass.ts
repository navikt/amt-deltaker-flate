import dayjs from 'dayjs'
import {
  IngenKostnaderAarsak,
  INNHOLD_TYPE_ANNET,
  Prisinformasjon,
  PrisinformasjonType
} from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding'
import { EnkeltplassKladdRequest } from '../api/data/kladd-request'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import { dateToIsoString, formatDateToDtoStr } from './utils'

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
    prisinformasjon: data.prisinformasjon,
    arrangorUnderenhet: data.arrangorUnderenhet,
    kodeverkValg: data.kodeverkValg.flatMap((kv) => kv.valgteIder),
    sertifiseringValg: data.sertifiseringValg,
    dagerPerUke: data.dagerPerUke
  }
}

// Denne vil i teorien aldri bli brukt, da skjemaet validerer at vi har valgt Prisinformasjon
// og generateEnkeltplassPameldingRequest blir kalt fra utkast, og den vil også ha Prisinformasjon.
const defaultPrisInformasjon: Prisinformasjon = {
  type: PrisinformasjonType.IngenKostnader,
  aarsak: IngenKostnaderAarsak.OPPLAERINGEN_ER_KOSTNADSFRI
}

export const formToEnkeltplassKladdRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassKladdRequest => {
  return formToEnkeltplassData(data)
}

export const formToEnkeltplassRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassPameldingRequest => {
  const { startdato, sluttdato, prisinformasjon, ...rest } =
    formToEnkeltplassData(data)

  return {
    ...rest,
    startdato: startdato ?? '',
    sluttdato: sluttdato ?? '',
    prisinformasjon: prisinformasjon ?? defaultPrisInformasjon
  }
}

export const generateEnkeltplassPameldingRequest = (
  deltaker: DeltakerResponse
): EnkeltplassPameldingRequest => {
  return {
    beskrivelse:
      deltaker.deltakelsesinnhold?.innhold.find(
        (i) => i.innholdskode === INNHOLD_TYPE_ANNET
      )?.beskrivelse || '',
    prisinformasjon:
      deltaker.deltakerliste.prisinformasjon ?? defaultPrisInformasjon,
    startdato: dateToIsoString(deltaker.startdato),
    sluttdato: dateToIsoString(deltaker.sluttdato),
    arrangorUnderenhet:
      deltaker.deltakerliste.arrangor?.organisasjonsnummer || '',
    kodeverkValg:
      deltaker.deltakerliste.opplaringKategoriseringValg?.valgteKategoriseringer.flatMap(
        (kodeverk) => kodeverk.valgteElementer.map((v) => v.id)
      ),
    sertifiseringValg:
      deltaker.deltakerliste.opplaringKategoriseringValg?.valgteSertifiseringer
  }
}

/**
 * Sjekker om pameldingen/deltakeren er en enkeltplass uten rammeavtale
 */
export const erEnkeltPlass = (deltaker: DeltakerResponse) => {
  return deltaker.deltakerliste.erEnkeltplass
}
