import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import './App.css'
import { DeferredFetchState, useDeferredFetch } from './hooks/useDeferredFetch'
import { getDeltakelse } from './api/api'
import { useEffect } from 'react'
import { DeltakerContextProvider } from './DeltakerContext'
import { DeltakerGuard } from './guards/DeltakerGuard'
import nb from 'dayjs/locale/nb'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { isEnvLocalDemoOrPr } from './utils/environment-utils.ts'
import { TilAktivitetsplanKnapp } from './components/TilAktivitetsplanKnapp.tsx'

dayjs.locale(nb)

const App = () => {
  const { deltakerId } = useParams()
  const {
    data: deltaker,
    state,
    error,
    doFetch: doFetchDeltakelse
  } = useDeferredFetch(getDeltakelse)

  useEffect(() => {
    if (deltakerId) {
      doFetchDeltakelse(deltakerId)
    }
  }, [])

  if (state === DeferredFetchState.LOADING) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="3xlarge" title="Venter..." />
      </div>
    )
  }

  if (error || !deltaker) {
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
    <DeltakerContextProvider initialDeltaker={deltaker}>
      {isEnvLocalDemoOrPr && <DemoBanner />}
      <TilAktivitetsplanKnapp />
      <DeltakerGuard />
    </DeltakerContextProvider>
  )
}

export default App
