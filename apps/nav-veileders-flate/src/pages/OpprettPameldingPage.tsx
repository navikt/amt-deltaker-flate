import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { PameldingFormContextProvider } from '../components/pamelding/PameldingFormContext.tsx'
import { PameldingForm } from '../components/pamelding/standard/PameldingForm.tsx'
import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { useDeltakerContext } from '../components/tiltak/DeltakerContext.tsx'

export const OpprettPameldingPage = () => {
  const { deltaker } = useDeltakerContext()

  return (
    <div className="md:m-auto m-4 max-w-190" data-testid="page_kladd">
      <Tilbakeknapp />
      <PameldingHeader
        deltakerStatus={deltaker.status}
        deltakerliste={deltaker.deltakerliste}
        vedtaksinformasjon={deltaker.vedtaksinformasjon}
      />

      <PameldingFormContextProvider>
        <PameldingForm className="mt-4 p-4 ax-md:p-8 bg-(--ax-bg-default)" />
      </PameldingFormContextProvider>
    </div>
  )
}
