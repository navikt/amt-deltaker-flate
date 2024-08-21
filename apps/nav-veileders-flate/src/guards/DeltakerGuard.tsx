import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import duration from 'dayjs/plugin/duration'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useAppContext } from '../AppContext.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../hooks/useModiaLink.ts'
import { OpprettPameldingPage } from '../pages/OpprettPameldingPage.tsx'
import { RedigerPameldingPage } from '../pages/RedigerPameldingPage.tsx'
import { TiltakPage } from '../pages/TiltakPage.tsx'
import { isEnvLocalDemoOrPr } from '../utils/environment-utils.ts'
import {
  deltakerStateFromSessionStorage,
  DetlakerStateSessionStorage,
  ssetPersonidentISessionStorage
} from '../utils/sessionStorage.ts'

dayjs.locale(nb)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(duration)

export const DeltakerGuard = () => {
  const { pamelding } = usePameldingContext()
  const { doRedirect } = useModiaLink()
  const { personident } = useAppContext()

  useEffect(() => {
    try {
      const deltakerState = deltakerStateFromSessionStorage()

      if ((deltakerState as DetlakerStateSessionStorage).brukerIKontekst) {
        if (
          deltakerState.brukerIKontekst !== personident &&
          !isEnvLocalDemoOrPr
        ) {
          ssetPersonidentISessionStorage(personident)
          doRedirect(DELTAKELSESOVERSIKT_LINK)
        }
      } else {
        ssetPersonidentISessionStorage(personident)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      ssetPersonidentISessionStorage(personident)
    }
  }, [personident])

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
