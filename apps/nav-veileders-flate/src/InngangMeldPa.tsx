import { Loader } from '@navikt/ds-react'
import { Tiltakskode, useFetch } from 'deltaker-flate-common'
import { useParams } from 'react-router-dom'
import { useAppContext } from './AppContext.tsx'
import { opprettKladd } from './api/api.ts'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { DeltakerContextProvider } from './components/tiltak/DeltakerContext.tsx'
import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import { useMock } from './utils/environment-utils.ts'
import { opprettEnkeltplassKladd } from './api/api-enkeltplass.ts'

const InngangMeldPa = () => {
  const { deltakerlisteId, tiltakskode: tiltakskodeParam } = useParams()
  const { personident, enhetId } = useAppContext()

  const tiltakskode = tiltakskodeParam as Tiltakskode | undefined

  if (deltakerlisteId === undefined && tiltakskode === undefined) {
    return <ErrorPage />
  }

  const {
    data: nyPamelding,
    loading,
    error
  } = deltakerlisteId
    ? useFetch(opprettKladd, personident, deltakerlisteId, enhetId)
    : useFetch(opprettEnkeltplassKladd, personident, tiltakskode!, enhetId)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="3xlarge" title="Venter..." />
      </div>
    )
  }

  if (error || !nyPamelding) {
    return <ErrorPage message={error} />
  }

  return (
    <DeltakerContextProvider initialDeltaker={nyPamelding}>
      {useMock && <DemoBanner />}
      <DeltakerGuard />
    </DeltakerContextProvider>
  )
}

export default InngangMeldPa
