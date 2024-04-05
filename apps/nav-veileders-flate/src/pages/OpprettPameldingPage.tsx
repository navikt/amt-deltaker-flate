import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'

export const OpprettPameldingPage = () => {
  const { pamelding } = usePameldingContext()

  return (
    <div className="m-4 max-w-[47.5rem] mx-auto">
      <PameldingHeader
        title="Kladd til påmelding"
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
        deltakerlisteId={pamelding.deltakerliste.deltakerlisteId}
      />

      <PameldingForm className="mt-4 p-8 bg-white" pamelding={pamelding} />
    </div>
  )
}
