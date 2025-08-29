export const getProsentError = (deltakelsesprosent: number | null) => {
  const isValid =
    deltakelsesprosent !== null &&
    0 < deltakelsesprosent &&
    deltakelsesprosent <= 100

  if (!isValid) {
    return 'Tallet må være et helt tall fra 1 til 100'
  }

  return undefined
}

export const getDagerPerUkeError = (
  deltakelsesprosent: number | null,
  dagerPerUke: number | null
) => {
  if (!dagerPerUke || deltakelsesprosent === 100) {
    return undefined
  }
  const isValid = 0 < dagerPerUke && dagerPerUke <= 5

  if (!isValid) {
    return 'Dager per uke må være et helt tall fra 1 til 5'
  }

  return undefined
}
