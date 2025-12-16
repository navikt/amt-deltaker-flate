import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'

export const OpprettPameldingPage = () => {
  const { pamelding } = usePameldingContext()

  return (
    <div className="md:m-auto m-4 max-w-190" data-testid="page_kladd">
      <Tilbakeknapp />
      <PameldingHeader
        title="Kladd til påmelding"
        deltakerliste={pamelding.deltakerliste}
      />

      <PameldingForm
        className="mt-4 p-4 md:p-8 bg-white"
        pamelding={pamelding}
      />
    </div>
  )
}
