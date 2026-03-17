import dayjs from 'dayjs'
import { INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import {
  EnkeltplassKladdRequest,
  KladdRequest
} from '../api/data/kladd-request'
import { DeltakerResponse } from '../api/data/pamelding'
import {
  DATE_FORMAT,
  PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import { PameldingFormValues } from '../model/PameldingFormValues'
import { generateInnholdFromResponse } from './pamelding-form-utils'
import { formatDateToDtoStr } from './utils'

export const formToEnkeltplassKladdRequest = (
  data: PameldingEnkeltplassFormValues
): EnkeltplassKladdRequest => {
  const startdato = dayjs(data.startdato, DATE_FORMAT, true)?.toDate()
  const sluttdato = dayjs(data.sluttdato, DATE_FORMAT, true)?.toDate()

  return {
    beskrivelse: data.beskrivelse,
    prisinformasjon: data.prisinformasjon,
    startdato: startdato ? formatDateToDtoStr(startdato) : undefined,
    sluttdato: sluttdato ? formatDateToDtoStr(sluttdato) : undefined
  }
}

export const formToKladdRequest = (
  pamelding: DeltakerResponse,
  data: PameldingFormValues
): KladdRequest => {
  const innhold = generateInnholdFromResponse(
    pamelding,
    data.valgteInnhold,
    data.innholdAnnetBeskrivelse,
    data.innholdsTekst
  )

  const innholdAnnet = innhold.find(
    (i) => i.innholdskode === INNHOLD_TYPE_ANNET
  )

  const korrigertInnhold = [
    ...innhold.filter((i) => i.innholdskode !== INNHOLD_TYPE_ANNET)
  ]

  if (innholdAnnet) {
    korrigertInnhold.push({
      innholdskode: INNHOLD_TYPE_ANNET,
      beskrivelse: innholdAnnet.beskrivelse || ''
    })
  }

  return {
    innhold: korrigertInnhold,
    bakgrunnsinformasjon: data.bakgrunnsinformasjon,
    deltakelsesprosent: data.deltakelsesprosent,
    dagerPerUke: data.dagerPerUke
  }
}
