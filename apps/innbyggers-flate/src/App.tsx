import { Alert, Heading } from '@navikt/ds-react'
import './App.css'

function App() {
  return (
    <Alert variant="info" className="m-4">
      <Heading size="small">Hva har vi?</Heading>
      Dette er foreløpig alt
    </Alert>
  )
}

export default App
