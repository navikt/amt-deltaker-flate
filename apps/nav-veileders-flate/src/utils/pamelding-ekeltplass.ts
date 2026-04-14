import dayjs from 'dayjs'
import { INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding'
import { DeltakerResponse } from '../api/data/deltaker'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import { formatDateToDtoStr } from './utils'

export const formToEnkeltplassRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassPameldingRequest => {
  const startdato = data.startdato
    ? dayjs(data.startdato, DATE_FORMAT, true)?.toDate()
    : null
  const sluttdato = data.sluttdato
    ? dayjs(data.sluttdato, DATE_FORMAT, true)?.toDate()
    : null

  return {
    beskrivelse: data.innhold,
    prisinformasjon: data.prisinformasjon,
    startdato: startdato ? formatDateToDtoStr(startdato) : undefined,
    sluttdato: sluttdato ? formatDateToDtoStr(sluttdato) : undefined,
    arrangorUnderenhet: data.arrangorUnderenhet
  }
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
    startdato: startdato ? formatDateToDtoStr(startdato) : undefined,
    sluttdato: sluttdato ? formatDateToDtoStr(sluttdato) : undefined,
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
