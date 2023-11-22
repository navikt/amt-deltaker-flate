export const BESKRIVELSE_MAX_TEGN = 500
export const BAKGRUNNSINFO_MAX_TEGN = 500

export const MAL_TYPE_ANNET = 'ANNET' // Fix når vi vet dette fra valp

export const DELTAKELSESPROSENT_VALG_JA = 'Ja'
export const DELTAKELSESPROSENT_VALG_NEI = 'Nei'

export const isValidFloatInRange = (value: string, from: number, to: number) => {
  const valueCorrected = value.replace(',', '.')
  const x = parseFloat(valueCorrected)

  return !(isNaN(x) || x < from || x > to)
}

export const erGyldigProsent = (value: string) => {
  return isValidFloatInRange(value, 0, 100)
}

export const erGyldigDagerPerUke = (value: string) => {
  return isValidFloatInRange(value, 0, 7)
}