import dayjs from 'dayjs'
import { INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding'
import { DeltakerResponse } from '../api/data/pamelding'
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
    arrangorOrgnummer: data.arrangorOrgnummer,
    startdato: startdato ? formatDateToDtoStr(startdato) : undefined,
    sluttdato: sluttdato ? formatDateToDtoStr(sluttdato) : undefined
  }
}

export const generateEnkeltplassPameldingRequest = (
  pamelding: DeltakerResponse
): EnkeltplassPameldingRequest => {
  const startdato = pamelding.startdato
    ? dayjs(pamelding.startdato, DATE_FORMAT, true)?.toDate()
    : null
  const sluttdato = pamelding.sluttdato
    ? dayjs(pamelding.sluttdato, DATE_FORMAT, true)?.toDate()
    : null

  return {
    beskrivelse:
      pamelding.deltakelsesinnhold?.innhold.find(
        (i) => i.innholdskode === INNHOLD_TYPE_ANNET
      )?.beskrivelse || '',
    prisinformasjon: '', // TODO fra gjennomføring pamelding.prisinformasjon,
    arrangorOrgnummer: '', // TODO: Populer fra nytt UI for valg av arrangør
    startdato: startdato ? formatDateToDtoStr(startdato) : undefined,
    sluttdato: sluttdato ? formatDateToDtoStr(sluttdato) : undefined
  }
}

/**
 * Sjekker om pameldingen er en enkeltplass uten rammeavtale
 */
export const erEnkeltPlassUtenRammeavtale = (pamelding: DeltakerResponse) => {
  return pamelding.deltakerliste.erEnkeltplassUtenRammeavtale
}
