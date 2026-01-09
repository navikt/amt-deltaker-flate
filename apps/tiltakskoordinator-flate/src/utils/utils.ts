import { Pameldingstype, Tiltakskode } from 'deltaker-flate-common'
import { DeltakerDetaljer } from '../api/data/deltaker'
import { Beskyttelsesmarkering, Deltaker } from '../api/data/deltakerliste'

export const lagDeltakerNavnEtternavnForst = (
  deltaker: Deltaker | DeltakerDetaljer
): string => {
  return [
    `${deltaker.etternavn}${deltaker.etternavn.length > 0 ? ',' : ''}`,
    deltaker.fornavn,
    deltaker.mellomnavn
  ]
    .filter(Boolean)
    .join(' ')
}

export function lagDeltakerNavn(deltaker: Deltaker | DeltakerDetaljer) {
  return [deltaker.fornavn, deltaker.mellomnavn, deltaker.etternavn]
    .filter(Boolean)
    .join(' ')
}

export const listDeltakerNavn = (deltakere: Deltaker[]): string => {
  return deltakere
    .map((deltaker) => lagDeltakerNavn(deltaker))
    .join(', ')
    .replace(/, ([^,]*)$/, ' og $1')
}

export const erAdresseBeskyttet = (
  beskyttelsesmarkering: Beskyttelsesmarkering[]
) => {
  return beskyttelsesmarkering.some(
    (b) =>
      b === Beskyttelsesmarkering.FORTROLIG ||
      b === Beskyttelsesmarkering.STRENGT_FORTROLIG ||
      b === Beskyttelsesmarkering.STRENGT_FORTROLIG_UTLAND
  )
}

export const formaterTelefonnummer = (
  telefonnummer: string | undefined | null
): string | null => {
  if (!telefonnummer) {
    return null
  }

  let tlf = telefonnummer.trim()

  if (tlf.startsWith('+47')) {
    tlf = tlf.replace('+47', '')
  }

  if (tlf.startsWith('47') && tlf.length === 10) {
    tlf = tlf.replace('47', '')
  }

  if (tlf.startsWith('0047') && tlf.length === 12) {
    tlf = tlf.replace('0047', '')
  }

  if (tlf.length === 8) {
    // Formater telefonnummer til: 11 22 33 44
    return `${tlf.substring(0, 2)} ${tlf.substring(2, 4)} ${tlf.substring(4, 6)} ${tlf.substring(6, 8)}`
  }

  return tlf
}

export const getDeltakereOppdatert = (
  deltakere: Deltaker[],
  oppdaterteDeltakere: Deltaker[]
) =>
  deltakere.map((deltaker) => {
    const oppdatertDeltaker = oppdaterteDeltakere.find(
      (oppdaterteDeltaker) => oppdaterteDeltaker.id === deltaker.id
    )
    return oppdatertDeltaker ?? deltaker
  })

export const gaTilGjennomforingerMulighetsrommet = () => {
  const currentPath = window.location.pathname
  const pathSegments = currentPath.split('/').filter(Boolean)

  const gjennomforingerIndex = pathSegments.indexOf('gjennomforinger')

  if (gjennomforingerIndex >= 0) {
    // Inkluder "gjennomforinger" + gjennomforingsId-en i url-en
    const newSegments = pathSegments.slice(0, gjennomforingerIndex + 2)
    const newPath = '/' + newSegments.join('/') + '/'

    window.location.pathname = newPath
  }
}

export const kanDeleDeltakerMedArrangorForVurdering = (
  pameldingstype: Pameldingstype,
  tiltakskode: Tiltakskode
) => {
  return (
    pameldingstype === Pameldingstype.TRENGER_GODKJENNING &&
    (tiltakskode === Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING ||
      tiltakskode === Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING ||
      tiltakskode === Tiltakskode.ARBEIDSMARKEDSOPPLAERING ||
      tiltakskode === Tiltakskode.FAG_OG_YRKESOPPLAERING ||
      tiltakskode ===
        Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV ||
      tiltakskode === Tiltakskode.STUDIESPESIALISERING ||
      tiltakskode === Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING)
  )
}
