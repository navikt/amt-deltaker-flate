import { useEffect, useState } from 'react'
import { ArenaTiltakskode, Tiltakskode } from '../model/deltaker.ts'
import { fetchToggles } from './feature-toggle-api.ts'
import { FeatureToggles, KOMET_ER_MASTER } from './feature-toggle-data.ts'

let cachedFeatureToggles: FeatureToggles | undefined = undefined

const alltidMasterForTiltakstyper = [
  ArenaTiltakskode.ARBFORB,
  Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
  ArenaTiltakskode.AVKLARAG,
  Tiltakskode.AVKLARING,
  ArenaTiltakskode.INDOPPFAG,
  Tiltakskode.OPPFOLGING,
  ArenaTiltakskode.ARBRRHDAG,
  Tiltakskode.ARBEIDSRETTET_REHABILITERING,
  ArenaTiltakskode.DIGIOPPARB,
  Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK,
  ArenaTiltakskode.VASV,
  Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET,
  ArenaTiltakskode.GRUPPEAMO,
  Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
  ArenaTiltakskode.JOBBK,
  Tiltakskode.JOBBKLUBB,
  ArenaTiltakskode.GRUFAGYRKE,
  Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING
]
const nyeTiltakstyper: unknown[] = []

export const useFeatureToggle = (baseUrl: string) => {
  const [toggles, setToggles] = useState<FeatureToggles>()

  useEffect(() => {
    if (cachedFeatureToggles) {
      setToggles(cachedFeatureToggles)
      return
    }
    fetchToggles(baseUrl).then((result) => {
      setToggles(result)
      cachedFeatureToggles = result
    })
  }, [baseUrl])

  const erKometMasterForTiltak = (
    tiltakstype: ArenaTiltakskode | Tiltakskode
  ) => {
    return !!(
      alltidMasterForTiltakstyper.includes(tiltakstype) ||
      (toggles?.[KOMET_ER_MASTER] && nyeTiltakstyper.includes(tiltakstype))
    )
  }

  return {
    erKometMasterForTiltak
  }
}
