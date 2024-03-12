import { Alert, Heading, Loader } from '@navikt/ds-react'
import dayjs from 'dayjs'
import './App.css'
import useFetch from './hooks/useFetch'
import { getDeltakelse } from './api/api'

dayjs.locale('nb')

function App() {
  const {
    data: deltaker,
    loading,
    error
  } = useFetch(getDeltakelse, '450e0f37-c4bb-4611-ac66-f725e05bad3e')

  if (loading) {
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
      Dette er foreløpig alt: {deltaker.deltakerId}
    </Alert>
  )
}

export default App
