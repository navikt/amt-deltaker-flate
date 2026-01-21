import {
  DeltakerStatusType,
  FeilregistrertInfo,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../DeltakerContext'
import { AvbruttUtkastPage } from '../pages/AvbruttUtkastPage.tsx'
import { DeltakerPage } from '../pages/DeltakerPage.tsx'
import { UtkastPage } from '../pages/UtkastPage.tsx'
import { DIALOG_URL } from '../utils/environment-utils'

export const DeltakerGuard = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakskode,
    deltaker.deltakerliste.arrangorNavn
  )

  let pageToLoad = null

  if (deltaker.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING) {
    pageToLoad = <UtkastPage />
  } else if (deltaker.status.type === DeltakerStatusType.AVBRUTT_UTKAST) {
    pageToLoad = <AvbruttUtkastPage />
  } else if (deltaker.status.type === DeltakerStatusType.FEILREGISTRERT) {
    pageToLoad = (
      <FeilregistrertInfo
        className="w-full"
        dialogUrl={DIALOG_URL}
        tiltakOgStedTekst={tiltakOgStedTekst}
        meldtPaDato={deltaker?.vedtaksinformasjon?.fattet}
        feilregistrertDato={deltaker.status.gyldigFra}
      />
    )
  } else {
    pageToLoad = <DeltakerPage />
  }

  return pageToLoad
}
