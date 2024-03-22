import { useParams } from 'react-router-dom'
import { useAppContext } from './AppContext.tsx'
import { Alert, Heading, Loader } from '@navikt/ds-react'
import useFetch from './hooks/useFetch.ts'
import { createPamelding } from './api/api.ts'
import { isEnvLocalDemoOrPr } from './utils/environment-utils.ts'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { PameldingContextProvider } from './components/tiltak/PameldingContext.tsx'
import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import { Tilbakeknapp } from './components/Tilbakeknapp.tsx'

const InngangMeldPa = () => {
  const {deltakerlisteId} = useParams()
  const {personident, enhetId} = useAppContext()

  if (deltakerlisteId === undefined) {
    return (
      <Alert variant="error" className="mt-4 mb-4">
        <Heading size="small" spacing level="3">
          Noe gikk galt. Prøv å gå inn på nytt gjennom Modia.
        </Heading>
      </Alert>
    )
  }

  const {
    data: nyPamelding,
    loading,
    error
  } = useFetch(createPamelding, personident, deltakerlisteId, enhetId)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="3xlarge" title="Venter..."/>
      </div>
    )
  }

  if (error || !nyPamelding) {
    return (
      <>
        {isEnvLocalDemoOrPr && <DemoBanner hasError/>}
        <Alert variant="error">
          <Heading spacing size="small" level="3">
            Vi beklager, men noe gikk galt
          </Heading>
          {error}
        </Alert>
      </>
    )
  }

  return (
    <PameldingContextProvider initialPamelding={nyPamelding}>
      {isEnvLocalDemoOrPr && <DemoBanner/>}
      <Tilbakeknapp/>
      <DeltakerGuard/>
    </PameldingContextProvider>
  )

}

export default InngangMeldPa
