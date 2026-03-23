import { Tilbakeknapp } from '../components/Tilbakeknapp.tsx'
import { PameldingFormContextProvider } from '../components/pamelding/PameldingFormContext.tsx'
import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { Utkast } from '../components/rediger-pamelding/Utkast.tsx'
import { usePameldingContext } from '../components/tiltak/PameldingContext.tsx'

export const RedigerPameldingPage = () => {
  const { pamelding } = usePameldingContext()

  return (
    <div className="max-w-190 ax-md:m-auto m-4" data-testid="page_utkast">
      <Tilbakeknapp />
      <PameldingHeader
        deltakerStatus={pamelding.status}
        deltakerliste={pamelding.deltakerliste}
        vedtaksinformasjon={pamelding.vedtaksinformasjon}
      />

      <div className="mt-4 md:p-8 p-4 bg-(--ax-bg-default)">
        <PameldingFormContextProvider>
          <Utkast />
        </PameldingFormContextProvider>
      </div>
    </div>
  )
}
