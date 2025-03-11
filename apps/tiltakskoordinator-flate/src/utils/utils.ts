export const lagDeltakerNavn = (
  fornavn: string,
  mellomnavn: string | null,
  etternavn: string
): string => {
  return [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ')
}
