import {
  DeltakerStatusType,
  FeilregistrertInfo,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext'
import { DIALOG_URL } from '../utils/environment-utils'

export const TiltakPage = () => {
  const { pamelding } = usePameldingContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    pamelding.deltakerliste.tiltakstype,
    pamelding.deltakerliste.arrangorNavn
  )

  return (
    <div className="max-w-[1252px] m-auto" data-testid="page_tiltak">
      <Tilbakeknapp />
      <div className="flex flex-col gap-4 xl:flex-row-reverse">
        <ForNAVAnsatt className="xl:max-w-[412px] w-full" />
        {pamelding.status.type === DeltakerStatusType.FEILREGISTRERT ? (
          <FeilregistrertInfo
            className="w-full"
            dialogUrl={DIALOG_URL}
            tiltakOgStedTekst={tiltakOgStedTekst}
            meldtPaDato={pamelding.vedtaksinformasjon?.fattet}
            feilregistrertDato={pamelding.status.gyldigFra}
          />
        ) : (
          <DeltakerInfo className="w-full" />
        )}
      </div>
    </div>
  )
}
