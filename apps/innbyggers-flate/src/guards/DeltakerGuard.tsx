import { DeltakerStatusType } from 'deltaker-flate-common'
import { useDeltakerContext } from '../DeltakerContext'
import { AvbruttUtkastPage } from '../pages/AvbruttUtkastPage.tsx'
import { TiltakPage } from '../pages/TiltakPage'
import { UtkastPage } from '../pages/UtkastPage.tsx'

export const DeltakerGuard = () => {
  const { deltaker } = useDeltakerContext()

  let pageToLoad = null

  if (deltaker.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING) {
    pageToLoad = <UtkastPage />
  } else if (deltaker.status.type === DeltakerStatusType.AVBRUTT_UTKAST) {
    pageToLoad = <AvbruttUtkastPage />
  } else {
    pageToLoad = <TiltakPage />
  }

  return pageToLoad
}
