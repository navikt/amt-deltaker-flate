import { useEffect, useState } from 'react'

import { FeatureToggles, KOMET_ER_MASTER } from '../api/data/feature-toggle'
import { fetchToggles } from '../api/feature-toggle-api'
import { ArenaTiltakskode } from 'deltaker-flate-common'

let cachedFeatureToggles: FeatureToggles | undefined = undefined

const masterForTiltakstyper = [
  ArenaTiltakskode.ARBFORB,
  ArenaTiltakskode.AVKLARAG,
  ArenaTiltakskode.INDOPPFAG,
  ArenaTiltakskode.ARBRRHDAG,
  ArenaTiltakskode.DIGIOPPARB,
  ArenaTiltakskode.VASV
]
const nyeTiltakstyper: ArenaTiltakskode[] = []

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

  const erKometMasterForTiltak = (tiltakstype: ArenaTiltakskode) => {
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
