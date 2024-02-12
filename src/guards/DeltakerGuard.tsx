import { DeltakerStatusType } from '../api/data/pamelding.ts'
import { OpprettPameldingPage } from '../pages/OpprettPameldingPage.tsx'
import { RedigerPameldingPage } from '../pages/RedigerPameldingPage.tsx'
import { TiltakPage } from '../pages/TiltakPage.tsx'
import { usePameldingCOntext } from '../components/tiltak/PameldingContext.tsx'

export const DeltakerGuard = () => {
  const { pamelding } = usePameldingCOntext()

  let pageToLoad = null

  if (pamelding.status.type === DeltakerStatusType.KLADD) {
    pageToLoad = <OpprettPameldingPage />
  } else if (pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING) {
    pageToLoad = <RedigerPameldingPage />
  } else {
    pageToLoad = <TiltakPage />
  }

  return pageToLoad
}
