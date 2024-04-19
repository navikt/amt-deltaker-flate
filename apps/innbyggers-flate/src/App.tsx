import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import './App.css'
import { DeferredFetchState, useDeferredFetch } from './hooks/useDeferredFetch'
import { getDeltakelse } from './api/api'
import { useEffect, useState } from 'react'
import { DeltakerContextProvider } from './DeltakerContext'
import { DeltakerGuard } from './guards/DeltakerGuard'
import nb from 'dayjs/locale/nb'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { TilAktivitetsplanLenke } from './components/TilAktivitetsplanLenke.tsx'
import { isEnvLocalDemoOrPr, isPrEvn } from './utils/environment-utils.ts'

dayjs.locale(nb)

const App = () => {
  const deltakerIdFraUrl = useParams().deltakerId
  const [deltakerIdPrSetting, setDeltakerIDprSetting] = useState('')

  const deltakerId = isPrEvn ? deltakerIdPrSetting : deltakerIdFraUrl

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
  }, [deltakerId])

  if (isPrEvn && !deltaker) {
    return <DemoBanner setDeltakerID={setDeltakerIDprSetting} />
  }

  if (state === DeferredFetchState.LOADING) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="3xlarge" title="Venter..." />
      </div>
    )
  }

  if (error || !deltaker) {
    return (
      <>
        {isEnvLocalDemoOrPr && (
          <DemoBanner setDeltakerID={setDeltakerIDprSetting} />
        )}
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
    <DeltakerContextProvider initialDeltaker={deltaker}>
      <TilAktivitetsplanLenke />
      {isEnvLocalDemoOrPr && (
        <DemoBanner setDeltakerID={setDeltakerIDprSetting} />
      )}
      <DeltakerGuard />
    </DeltakerContextProvider>
  )
}

export default App
