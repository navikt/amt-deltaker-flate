import { useEffect, useState } from 'react'
import { Tiltakskode } from '../model/deltaker.ts'
import { fetchToggles } from './feature-toggle-api.ts'
import { FeatureToggles, KOMET_ER_MASTER } from './feature-toggle-data.ts'

let cachedFeatureToggles: FeatureToggles | undefined = undefined

const alltidMasterForTiltakskoder = [
  Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
  Tiltakskode.AVKLARING,
  Tiltakskode.OPPFOLGING,
  Tiltakskode.ARBEIDSRETTET_REHABILITERING,
  Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK,
  Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET,
  Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING,
  Tiltakskode.JOBBKLUBB,
  Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING,
  Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
  Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
  Tiltakskode.STUDIESPESIALISERING,
  Tiltakskode.FAG_OG_YRKESOPPLAERING
  // Denne eksisterer fra før i Arena Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING,
  // TODO når vi er master, sett inn Tiltakskode.TILPASSET_JOBBSTOTTE
]
const nyeTiltakskoder: unknown[] = [Tiltakskode.TILPASSET_JOBBSTOTTE]

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

  const erKometMasterForTiltak = (tiltakskode: Tiltakskode) => {
    return !!(
      alltidMasterForTiltakskoder.includes(tiltakskode) ||
      (toggles?.[KOMET_ER_MASTER] && nyeTiltakskoder.includes(tiltakskode))
    )
  }

  return {
    erKometMasterForTiltak
  }
}
