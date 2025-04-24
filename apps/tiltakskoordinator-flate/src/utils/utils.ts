import { Beskyttelsesmarkering, Deltaker } from '../api/data/deltakerliste'

export const lagDeltakerNavn = (
  fornavn: string,
  mellomnavn: string | null,
  etternavn: string
): string => {
  return [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ')
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
