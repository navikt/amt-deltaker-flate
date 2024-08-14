import { Loader } from '@navikt/ds-react'
import { useFetch } from 'deltaker-flate-common'
import { useParams } from 'react-router-dom'
import { useAppContext } from './AppContext.tsx'
import { createPamelding } from './api/api.ts'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { PameldingContextProvider } from './components/tiltak/PameldingContext.tsx'
import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import { isEnvLocalDemoOrPr } from './utils/environment-utils.ts'

const InngangMeldPa = () => {
  const { deltakerlisteId } = useParams()
  const { personident, enhetId } = useAppContext()

  if (deltakerlisteId === undefined) {
    return <ErrorPage />
  }

  const {
    data: nyPamelding,
    loading,
    error
  } = useFetch(createPamelding, personident, deltakerlisteId, enhetId)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="3xlarge" title="Venter..." />
      </div>
    )
  }

  if (error || !nyPamelding) {
    return (
      <>
        {isEnvLocalDemoOrPr && <DemoBanner />}
        <ErrorPage message="Kunne ikke opprette kladd for påmelding." />
      </>
    )
  }

  return (
    <PameldingContextProvider initialPamelding={nyPamelding}>
      {isEnvLocalDemoOrPr && <DemoBanner />}
      <DeltakerGuard />
    </PameldingContextProvider>
  )
}

export default InngangMeldPa
