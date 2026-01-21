import {
  DeltakerStatusType,
  FeilregistrertInfo,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'
import { DIALOG_URL } from '../utils/environment-utils.ts'

export const DeltakerPage = () => {
  const { pamelding } = usePameldingContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    pamelding.deltakerliste.tiltakskode,
    pamelding.deltakerliste.arrangorNavn
  )

  return (
    <div className="max-w-313 m-auto" data-testid="page_tiltak">
      <Tilbakeknapp />
      <div className="flex flex-col gap-4 xl:flex-row-reverse">
        <ForNAVAnsatt className="xl:max-w-103 w-full" />
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
