import { useEffect, useState } from 'react'

export function useDeltakelsesmengdeValidering(
  deltakelsesprosent: number | null,
  dagerPerUke: number | null,
  opprinneligDagerPerUke: number | null,
  opprinneligDeltakelsesprosent: number | null
) {
  const [deltakelsesprosentError, setDeltakelsesprosentError] =
    useState<string>()
  const [dagerPerUkeError, setDagerPerUkeError] = useState<string>()

  const validerProsent = () => {
    const isValid =
      deltakelsesprosent !== null &&
      0 < deltakelsesprosent &&
      deltakelsesprosent <= 100

    if (!deltakelsesprosent && dagerPerUke === opprinneligDagerPerUke) {
      setDeltakelsesprosentError(undefined)
    }
    if (!isValid) {
      setDeltakelsesprosentError('Tallet må være et helt tall fra 1 til 100')
      return false
    }
    if (
      deltakelsesprosent === opprinneligDeltakelsesprosent &&
      dagerPerUke &&
      dagerPerUke === opprinneligDagerPerUke
    ) {
      setDeltakelsesprosentError(
        'Både deltakelsesprosent og dager i uken kan ikke være lik det som er registrert fra før.'
      )
      return false
    } else if (
      deltakelsesprosent === opprinneligDeltakelsesprosent &&
      opprinneligDeltakelsesprosent === 100
    ) {
      setDeltakelsesprosentError(
        'Deltakelsesprosent kan ikke være lik det som er registrert fra før.'
      )
      return false
    } else {
      setDagerPerUkeError(undefined)
      setDeltakelsesprosentError(undefined)
    }

    setDeltakelsesprosentError(undefined)
    return true
  }

  const validerDager = () => {
    if (!dagerPerUke && deltakelsesprosent === opprinneligDeltakelsesprosent) {
      setDeltakelsesprosentError(undefined)
    }
    if (!dagerPerUke || deltakelsesprosent === 100) {
      setDagerPerUkeError(undefined)
      return true
    }
    const isValid = dagerPerUke ? 0 < dagerPerUke && dagerPerUke <= 5 : true

    if (!isValid) {
      setDagerPerUkeError('Dager per uke må være et helt tall fra 1 til 5')
      return false
    }

    if (
      deltakelsesprosent === opprinneligDeltakelsesprosent &&
      dagerPerUke === opprinneligDagerPerUke
    ) {
      setDagerPerUkeError(
        'Både deltakelsesprosent og dager i uken kan ikke være lik det som er registrert fra før.'
      )
      return false
    } else {
      setDagerPerUkeError(undefined)
      setDeltakelsesprosentError(undefined)
    }

    setDagerPerUkeError(undefined)
    return true
  }

  useEffect(() => {
    if (deltakelsesprosent === null) {
      setDeltakelsesprosentError(undefined)
      return
    }
    validerProsent()
  }, [deltakelsesprosent])

  useEffect(() => {
    validerDager()
  }, [dagerPerUke])

  const isValid =
    deltakelsesprosent && !deltakelsesprosentError && !dagerPerUkeError

  return {
    deltakelsesprosentError,
    dagerPerUkeError,
    isValid
  }
}
