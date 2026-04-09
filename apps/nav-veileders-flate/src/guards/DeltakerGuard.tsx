import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import duration from 'dayjs/plugin/duration'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { useDeltakerContext } from '../components/tiltak/DeltakerContext.tsx'
import { OpprettPameldingPage } from '../pages/OpprettPameldingPage.tsx'
import { RedigerPameldingPage } from '../pages/RedigerPameldingPage.tsx'
import { DeltakerPage } from '../pages/DeltakerPage.tsx'
import { OpprettEnkeltplassPameldingPage } from '../pages/OpprettEnkeltplassPameldingPage.tsx'

dayjs.locale(nb)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(duration)

export const DeltakerGuard = () => {
  const { deltaker } = useDeltakerContext()

  if (
    deltaker.status.type === DeltakerStatusType.KLADD &&
    deltaker.deltakerliste.erEnkeltplass
  ) {
    return <OpprettEnkeltplassPameldingPage />
  } else if (deltaker.status.type === DeltakerStatusType.KLADD) {
    return <OpprettPameldingPage />
  } else if (
    deltaker.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING ||
    deltaker.status.type === DeltakerStatusType.AVBRUTT_UTKAST
  ) {
    return <RedigerPameldingPage />
  }

  return <DeltakerPage />
}
