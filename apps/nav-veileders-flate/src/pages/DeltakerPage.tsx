import {
  DeltakerStatusType,
  FeilregistrertInfo,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'
import { useDeltakerContext } from '../components/tiltak/DeltakerContext.tsx'
import { DIALOG_URL } from '../utils/environment-utils.ts'

export const DeltakerPage = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakskode,
    deltaker.deltakerliste.arrangorNavn
  )

  return (
    <div className="max-w-313 m-auto" data-testid="page_tiltak">
      <Tilbakeknapp />
      <div className="flex flex-col gap-4 ax-xl:flex-row-reverse">
        <ForNAVAnsatt className="xl:max-w-103 w-full" />
        {deltaker.status.type === DeltakerStatusType.FEILREGISTRERT ? (
          <FeilregistrertInfo
            className="w-full"
            dialogUrl={DIALOG_URL}
            tiltakOgStedTekst={tiltakOgStedTekst}
            meldtPaDato={deltaker.vedtaksinformasjon?.fattet}
            feilregistrertDato={deltaker.status.gyldigFra}
          />
        ) : (
          <DeltakerInfo className="w-full" />
        )}
      </div>
    </div>
  )
}
