import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'
import { OpprettPameldingPage } from '../pages/OpprettPameldingPage.tsx'
import { RedigerPameldingPage } from '../pages/RedigerPameldingPage.tsx'
import { TiltakPage } from '../pages/TiltakPage.tsx'

dayjs.locale(nb)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export const DeltakerGuard = () => {
  const { pamelding } = usePameldingContext()

  let pageToLoad = null

  if (pamelding.status.type === DeltakerStatusType.KLADD) {
    pageToLoad = <OpprettPameldingPage />
  } else if (
    pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING ||
    pamelding.status.type === DeltakerStatusType.AVBRUTT_UTKAST
  ) {
    pageToLoad = <RedigerPameldingPage />
  } else {
    pageToLoad = <TiltakPage />
  }

  return pageToLoad
}
