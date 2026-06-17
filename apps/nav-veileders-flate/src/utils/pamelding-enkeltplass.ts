import dayjs from 'dayjs'
import { Prisinformasjon, PrisinformasjonType } from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import { formatDateToDtoStr } from './utils'
import { EnkeltplassKladdRequest } from '../api/data/kladd-request'

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
    prisinformasjon: data.prisinformasjon
      ? (formatPrisinformasjonForKladd(
          data.prisinformasjon
        ) as unknown as Prisinformasjon)
      : null,
    arrangorUnderenhet: data.arrangorUnderenhet,
    kodeverkValg: data.kodeverkValg.flatMap((kv) => kv.valgteIder),
    sertifiseringValg: data.sertifiseringValg
  }
}

export const formToEnkeltplassKladdRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassKladdRequest => {
  return formToEnkeltplassData(data)
}

const formatPrisinformasjonForApi = (
  prisinformasjon: PameldingEnkeltplassFormValues['prisinformasjon']
): Prisinformasjon => {
  if (!prisinformasjon) {
    throw new Error('Prisinformasjon er påkrevd')
  }

  // The form prisinformasjon matches the Prisinformasjon type structure
  return prisinformasjon as unknown as Prisinformasjon
}

const formatPrisinformasjonForKladd = (
  prisinformasjon: PameldingEnkeltplassFormValues['prisinformasjon']
): unknown => {
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
    // Return record format - schema will transform to array
    return {
      type: PrisinformasjonType.Tilskudd,
      tilskudd: Object.fromEntries(
        prisinformasjon.tilskudd.map((t) => [t.tilskudd, t.belop])
      ),
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

  return undefined
}

export const getPrisInformasjon = formatPrisinformasjonForKladd

export const formToEnkeltplassRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassPameldingRequest => {
  const { startdato, sluttdato, ...rest } = formToEnkeltplassData(data)
  const prisinformasjon = formatPrisinformasjonForApi(data.prisinformasjon)

  return {
    ...rest,
    startdato: startdato ?? '',
    sluttdato: sluttdato ?? '',
    prisinformasjon
  }
}

export const generateEnkeltplassPameldingRequest = (
  _deltaker: DeltakerResponse
): EnkeltplassPameldingRequest => {
  void _deltaker // unused parameter - this function should not be used
  throw new Error(
    'generateEnkeltplassPameldingRequest should not be used. Use form data with formToEnkeltplassRequest instead.'
  )
}

/**
 * Sjekker om pameldingen er en enkeltplass uten rammeavtale
 */
export const erEnkeltPlass = (pamelding: DeltakerResponse) => {
  return pamelding.deltakerliste.erEnkeltplass
}
