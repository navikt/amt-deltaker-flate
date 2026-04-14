import dayjs from 'dayjs'
import { INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding'
import { DeltakerResponse } from '../api/data/deltaker'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import { formatDateToDtoStr } from './utils'
import { EnkeltplassKladdRequest } from '../api/data/kladd-request'

const formToEnkeltplassData = (data: PameldingEnkeltplassFormValues) => {
  const startdato = data.startdato
    ? formatDateToDtoStr(dayjs(data.startdato, DATE_FORMAT, true).toDate())
    : undefined
  const sluttdato = data.sluttdato
    ? formatDateToDtoStr(dayjs(data.sluttdato, DATE_FORMAT, true).toDate())
    : undefined

  return {
    beskrivelse: data.innhold,
    prisinformasjon: data.prisinformasjon,
    startdato,
    sluttdato,
    arrangorUnderenhet: data.arrangorUnderenhet
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
  const startdato = deltaker.startdato
    ? dayjs(deltaker.startdato, DATE_FORMAT, true)?.toDate()
    : null
  const sluttdato = deltaker.sluttdato
    ? dayjs(deltaker.sluttdato, DATE_FORMAT, true)?.toDate()
    : null

  return {
    beskrivelse:
      deltaker.deltakelsesinnhold?.innhold.find(
        (i) => i.innholdskode === INNHOLD_TYPE_ANNET
      )?.beskrivelse || '',
    prisinformasjon: deltaker.prisinformasjon || '',
    startdato: startdato ? formatDateToDtoStr(startdato) : '',
    sluttdato: sluttdato ? formatDateToDtoStr(sluttdato) : '',
    arrangorUnderenhet:
      deltaker.deltakerliste.arrangor?.organisasjonsnummer || ''
  }
}

/**
 * Sjekker om pameldingen er en enkeltplass uten rammeavtale
 */
export const erEnkeltPlass = (pamelding: DeltakerResponse) => {
  return pamelding.deltakerliste.erEnkeltplass
}
