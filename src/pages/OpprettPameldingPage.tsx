import { PameldingResponse } from '../api/data/pamelding.ts'

import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'

export interface OpprettPameldingPageProps {
  pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({ pamelding }: OpprettPameldingPageProps) => {

  return (
    <div className="m-4">
      <PameldingHeader
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />

      <PameldingForm className="mt-4 p-8 bg-white" pamelding={pamelding} />
    </div>
  )
}
