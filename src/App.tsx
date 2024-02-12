import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import 'dayjs/locale/nb'
import dayjs from 'dayjs'
import { PameldingContextProvider } from './components/tiltak/PameldingContext.tsx'
import { useAppContext } from './AppContext.tsx'
import useFetch from './hooks/useFetch.ts'
import { createPamelding } from './api/api.ts'
import { Alert, Heading, Loader } from '@navikt/ds-react'

dayjs.locale('nb')

const App = () => {
  const { personident, deltakerlisteId, enhetId } = useAppContext()
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
      <Alert variant="error">
        <Heading spacing size="small" level="3">
          Vi beklager, men noe gikk galt
        </Heading>
        {error}
      </Alert>
    )
  }

  return (
    <PameldingContextProvider initialPamelding={nyPamelding}>
      <DeltakerGuard />
    </PameldingContextProvider>
  )
}

export default App
