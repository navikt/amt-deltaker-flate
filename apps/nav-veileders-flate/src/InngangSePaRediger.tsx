import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useFetch } from 'deltaker-flate-common'
import { useParams } from 'react-router-dom'
import { getPamelding } from './api/api.ts'
import { Tilbakeknapp } from './components/Tilbakeknapp.tsx'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { PameldingContextProvider } from './components/tiltak/PameldingContext.tsx'
import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import { isEnvLocalDemoOrPr } from './utils/environment-utils.ts'

const InngangSePaRediger = () => {
  const { deltakerId } = useParams()

  if (deltakerId === undefined) {
    return (
      <Alert variant="error" className="mt-4 mb-4">
        <Heading size="small" spacing level="3">
          Noe gikk galt. Prøv å gå inn på nytt gjennom Modia.
        </Heading>
      </Alert>
    )
  }

  const {
    data: pamelding,
    loading,
    error
  } = useFetch(getPamelding, deltakerId!)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="3xlarge" title="Venter..." />
      </div>
    )
  }

  if (error || !pamelding) {
    return (
      <>
        {isEnvLocalDemoOrPr && <DemoBanner />}
        <ErrorPage message={error} />
      </>
    )
  }

  return (
    <PameldingContextProvider initialPamelding={pamelding}>
      {isEnvLocalDemoOrPr && <DemoBanner />}
      <Tilbakeknapp />
      <DeltakerGuard />
    </PameldingContextProvider>
  )
}

export default InngangSePaRediger
