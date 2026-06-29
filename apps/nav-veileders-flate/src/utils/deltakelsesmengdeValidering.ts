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

export const getDagerPerUkeError = ({
  deltakelsesprosent,
  dagerPerUke,
  maxDagerPerUke
}: {
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  maxDagerPerUke: number
}) => {
  if (!dagerPerUke || deltakelsesprosent === 100) {
    return undefined
  }
  const isValid = 0 < dagerPerUke && dagerPerUke <= maxDagerPerUke

  if (!isValid) {
    return `Dager per uke må være et helt tall fra 1 til ${maxDagerPerUke}`
  }

  return undefined
}
