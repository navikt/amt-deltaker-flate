export const lagDeltakerNavn = (
  fornavn: string,
  mellomnavn: string | null,
  etternavn: string
): string => {
  return [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ')
}

export const formatTelefonnummer = (telefonnummer: string): string => {
  return telefonnummer.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3')
}
