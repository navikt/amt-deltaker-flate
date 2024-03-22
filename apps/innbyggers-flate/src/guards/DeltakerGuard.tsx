import { useDeltakerContext } from '../DeltakerContext'
import { DeltakerStatusType } from '../api/data/deltaker'
import { UtkastPage } from '../pages/UtkastPage'
import { TiltakPage } from '../pages/TiltakPage'

export const DeltakerGuard = () => {
  const { deltaker } = useDeltakerContext()

  let pageToLoad = null

  if (deltaker.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING) {
    pageToLoad = <UtkastPage />
  } else {
    pageToLoad = <TiltakPage />
  }

  return pageToLoad
}
