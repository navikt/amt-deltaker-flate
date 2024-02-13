import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { usePameldingCOntext } from '../components/tiltak/PameldingContext.tsx'

export const OpprettPameldingPage = () => {
  const { pamelding } = usePameldingCOntext()

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
