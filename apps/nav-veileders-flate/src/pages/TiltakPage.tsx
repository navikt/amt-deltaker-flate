import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'
import { FeilregistrertInfo } from 'deltaker-flate-common'
import { usePameldingContext } from '../components/tiltak/PameldingContext'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { DIALOG_URL } from '../utils/environment-utils'

export const TiltakPage = () => {
  const { pamelding } = usePameldingContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    pamelding.deltakerliste.tiltakstype,
    pamelding.deltakerliste.arrangorNavn
  )

  return (
    <div className="max-w-[1252px] m-auto">
      <Tilbakeknapp />
      <div className="flex flex-col gap-4 xl:flex-row-reverse">
        <ForNAVAnsatt className="xl:max-w-[412px] w-full" />
        {pamelding.status.type === DeltakerStatusType.FEILREGISTRERT &&
        pamelding.vedtaksinformasjon ? (
          <FeilregistrertInfo
            className="w-full"
            dialogUrl={DIALOG_URL}
            tiltakOgStedTekst={tiltakOgStedTekst}
            vedtaksinformasjon={pamelding.vedtaksinformasjon}
            feilregistrertDato={pamelding.status.gyldigFra}
          />
        ) : (
          <DeltakerInfo className="w-full" />
        )}
      </div>
    </div>
  )
}
