import { Alert, Heading, Loader } from '@navikt/ds-react'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'
import { getDeltakelse } from './api/api'
import PrBanner from './components/demo-banner/PrBanner.tsx'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { isPrEvn, useMock } from './utils/environment-utils.ts'
import { DeltakerContextProvider } from './DeltakerContext.tsx'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { TilAktivitetsplanLenke } from './components/TilAktivitetsplanLenke.tsx'
import { DeltakerGuard } from './guards/DeltakerGuard.tsx'

dayjs.locale(nb)

export const App = () => {
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

  return (
    <>
      {isPrEvn && <PrBanner setDeltakerID={setDeltakerIDprSetting} />}

      {state === DeferredFetchState.LOADING && (
        <main className="flex justify-center items-center h-screen">
          <Loader size="3xlarge" title="Venter..." />
        </main>
      )}

      {(error || (state === DeferredFetchState.RESOLVED && !deltaker)) && (
        <main>
          <Alert variant="error" className="mt-4">
            <Heading spacing size="small" level="3">
              Vi beklager, men noe gikk galt
            </Heading>
            {error}
          </Alert>
        </main>
      )}

      {!error && deltaker && (
        <DeltakerContextProvider initialDeltaker={deltaker}>
          {useMock && <DemoBanner />}
          <TilAktivitetsplanLenke />
          <main>
            <DeltakerGuard />
          </main>
        </DeltakerContextProvider>
      )}
    </>
  )
}
