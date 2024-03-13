import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import './App.css'
import { DeferredFetchState, useDeferredFetch } from './hooks/useDeferredFetch'
import { getDeltakelse } from './api/api'
import { useEffect } from 'react'

dayjs.locale('nb')

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
    <Alert variant="info" className="m-4">
      <Heading size="small">Hva har vi?</Heading>
      Dette er foreløpig alt: {deltaker.status.type}
    </Alert>
  )
}

export default App
