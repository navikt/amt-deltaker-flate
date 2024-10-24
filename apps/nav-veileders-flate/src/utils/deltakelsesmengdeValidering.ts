export const getProsentError = (
  deltakelsesprosent: number | null,
  dagerPerUke: number | null,
  opprinneligDagerPerUke: number | null,
  opprinneligDeltakelsesprosent: number | null
) => {
  const isValid =
    deltakelsesprosent !== null &&
    0 < deltakelsesprosent &&
    deltakelsesprosent <= 100

  if (!isValid) {
    return 'Tallet må være et helt tall fra 1 til 100'
  }
  if (
    deltakelsesprosent === opprinneligDeltakelsesprosent &&
    dagerPerUke === opprinneligDagerPerUke
  ) {
    return 'Både deltakelsesprosent og dager i uken kan ikke være lik det som er registrert fra før.'
  } else if (
    deltakelsesprosent === opprinneligDeltakelsesprosent &&
    opprinneligDeltakelsesprosent === 100
  ) {
    return 'Deltakelsesprosent kan ikke være lik det som er registrert fra før.'
  }

  return undefined
}

export const getDagerPerUkeError = (
  deltakelsesprosent: number | null,
  dagerPerUke: number | null,
  opprinneligDagerPerUke: number | null,
  opprinneligDeltakelsesprosent: number | null
) => {
  if (
    deltakelsesprosent === opprinneligDeltakelsesprosent &&
    dagerPerUke === opprinneligDagerPerUke
  ) {
    return 'Både deltakelsesprosent og dager i uken kan ikke være lik det som er registrert fra før.'
  }
  if (!dagerPerUke || deltakelsesprosent === 100) {
    return undefined
  }
  const isValid = dagerPerUke ? 0 < dagerPerUke && dagerPerUke <= 5 : true

  if (!isValid) {
    return 'Dager per uke må være et helt tall fra 1 til 5'
  }

  return undefined
}
