import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'
import { FeilregistrertInfo } from 'deltaker-flate-common'
import { usePameldingContext } from '../components/tiltak/PameldingContext'
import { DeltakerStatusType } from 'deltaker-flate-common'

export const TiltakPage = () => {
  const { pamelding } = usePameldingContext()

  return (
    <div className="max-w-[1252px] m-auto">
      <Tilbakeknapp />
      <div className="flex flex-col gap-4 xl:flex-row-reverse">
        <ForNAVAnsatt className="xl:max-w-[412px] w-full" />
        {pamelding.status.type === DeltakerStatusType.FEILREGISTRERT ? (
          <FeilregistrertInfo className="w-full" />
        ) : (
          <DeltakerInfo className="w-full" />
        )}
      </div>
    </div>
  )
}
