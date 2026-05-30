import dayjs from 'dayjs'
import { INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding'
import { EnkeltplassKladdRequest } from '../api/data/kladd-request'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import { formatDateToDtoStr } from './utils'

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
    prisinformasjon: data.prisinformasjon,
    startdato,
    sluttdato,
    arrangorUnderenhet: data.arrangorUnderenhet,
    kodeverkValg: data.kodeverkValg,
    sertifiseringValg: data.sertifiseringValg
  }
}

export const formToEnkeltplassKladdRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassKladdRequest => formToEnkeltplassData(data)

export const formToEnkeltplassRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassPameldingRequest => {
  const { startdato, sluttdato, ...rest } = formToEnkeltplassData(data)
  return { ...rest, startdato: startdato ?? '', sluttdato: sluttdato ?? '' }
}

export const generateEnkeltplassPameldingRequest = (
  deltaker: DeltakerResponse
): EnkeltplassPameldingRequest => {
  const parsedStartdato = deltaker.startdato ? dayjs(deltaker.startdato) : null
  const startdato = parsedStartdato?.isValid()
    ? formatDateToDtoStr(parsedStartdato.toDate())
    : ''

  const parsedSluttdato = deltaker.sluttdato ? dayjs(deltaker.sluttdato) : null
  const sluttdato = parsedSluttdato?.isValid()
    ? formatDateToDtoStr(parsedSluttdato.toDate())
    : ''

  return {
    beskrivelse:
      deltaker.deltakelsesinnhold?.innhold.find(
        (i) => i.innholdskode === INNHOLD_TYPE_ANNET
      )?.beskrivelse || '',
    prisinformasjon: deltaker.prisinformasjon || '',
    startdato,
    sluttdato,
    arrangorUnderenhet:
      deltaker.deltakerliste.arrangor?.organisasjonsnummer || '',
    kodeverkValg: deltaker.deltakerliste.kodeverk?.valgteKodeverkIder,
    sertifiseringValg: deltaker.deltakerliste.kodeverk?.valgteSertifiseringer
  }
}

/**
 * Sjekker om pameldingen er en enkeltplass uten rammeavtale
 */
export const erEnkeltPlass = (pamelding: DeltakerResponse) => {
  return pamelding.deltakerliste.erEnkeltplass
}
