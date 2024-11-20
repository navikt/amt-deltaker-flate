import { useEffect, useState } from 'react'

import { FeatureToggles, KOMET_ER_MASTER } from '../api/data/feature-toggle'
import { fetchToggles } from '../api/feature-toggle-api'
import { Tiltakstype } from 'deltaker-flate-common'

let cachedFeatureToggles: FeatureToggles | undefined = undefined

const masterForTiltakstyper = [
  Tiltakstype.ARBFORB,
  Tiltakstype.AVKLARAG,
  Tiltakstype.INDOPPFAG,
  Tiltakstype.ARBRRHDAG
]
const nyeTiltakstyper = [Tiltakstype.DIGIOPPARB, Tiltakstype.VASV]

export const useFeatureToggle = () => {
  const [toggles, setToggles] = useState<FeatureToggles>()

  useEffect(() => {
    if (cachedFeatureToggles) {
      setToggles(cachedFeatureToggles)
      return
    }
    fetchToggles().then((result) => {
      setToggles(result)
      cachedFeatureToggles = result
    })
  }, [])

  const erKometMasterForTiltak = (tiltakstype: Tiltakstype) => {
    if (
      masterForTiltakstyper.includes(tiltakstype) ||
      (toggles?.[KOMET_ER_MASTER] && nyeTiltakstyper.includes(tiltakstype))
    ) {
      return true
    }
    return false
  }

  return {
    erKometMasterForTiltak
  }
}
