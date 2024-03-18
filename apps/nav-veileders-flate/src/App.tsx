import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import 'dayjs/locale/nb'
import dayjs from 'dayjs'
import { PameldingContextProvider } from './components/tiltak/PameldingContext.tsx'
import { useAppContext } from './AppContext.tsx'
import useFetch from './hooks/useFetch.ts'
import { createPamelding } from './api/api.ts'
import { Alert, Heading, Loader } from '@navikt/ds-react'
import { isEnvLocalDemoOrPr } from './utils/environment-utils.ts'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'

dayjs.locale('nb')

const App = () => {
  const { personident, enhetId } = useAppContext()
  const {
    data: nyPamelding,
    loading,
    error
  } = useFetch(createPamelding, personident, '8671fef4-f051-4d19-9da7-5b435d31f8f4', enhetId)

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
        {isEnvLocalDemoOrPr && <DemoBanner hasError />}
        <Alert variant="error">
          <Heading spacing size="small" level="3">
            Vi beklager, men noe gikk galt
          </Heading>
          {error}
          <div></div>
        </Alert>
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

export default App
