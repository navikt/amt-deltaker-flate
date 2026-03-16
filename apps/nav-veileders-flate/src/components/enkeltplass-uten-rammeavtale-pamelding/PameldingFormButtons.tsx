import { DeltakerStatusType } from 'deltaker-flate-common'
import { EnkeltplassKladdRequest } from '../../api/data/kladd-request.ts'
import { formToEnkeltplassKladdRequest } from '../../utils/kladd.ts'
import { KladdLagring } from '../KladdLagring.tsx'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'
import { DelUtkastButton } from './del-utkast/DelUtkastButton.tsx'
import { MeldPaDirekteButton } from './meld-pa-direkte/MeldPaDirekteButton.tsx'
import { SlettKladdButton } from './slett-kladd/SlettKladdButton.tsx'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues.ts'
import { oppdaterKladd } from '../../api/api-enkeltplass.ts'

interface Props {
  className?: string
}

export const PameldingFormButtons = ({ className }: Props) => {
  const { pamelding } = usePameldingContext()

  return (
    <>
      <div className={`flex gap-4 ${className ?? ''}`}>
        <DelUtkastButton />
        <MeldPaDirekteButton />
        <SlettKladdButton />
      </div>

      {pamelding.status.type === DeltakerStatusType.KLADD && (
        <div className="mt-2">
          <KladdLagring<PameldingEnkeltplassFormValues, EnkeltplassKladdRequest>
            pamelding={pamelding}
            oppdaterKladd={oppdaterKladd}
            formToKladdRequest={formToEnkeltplassKladdRequest}
          />
        </div>
      )}
    </>
  )
}
