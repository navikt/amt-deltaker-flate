import {Pamelding} from './pamelding/Pamelding'
import {createPamelding, deletePamelding} from './api/api.ts'
import {Alert, Button, Heading, Loader} from '@navikt/ds-react'
import {useAppContext} from './AppContext.tsx'
import useFetch from './hooks/useFetch.ts'
import {Link} from 'react-router-dom'

const App = () => {
  const {personident, deltakerlisteId, enhetId} = useAppContext()

  const {
    data: pamelding,
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

  if (error || !pamelding) {
    return (
      <Alert variant="error">
        <Heading spacing size="small" level="3">
                    Vi beklager, men noe gikk galt
        </Heading>
        {error}
      </Alert>
    )
  }

  const avbrytPamelding = () => {
    // Hvis vi autolagerer i fremtiden vil vi ikke slette ved avbryt!
    if (pamelding) deletePamelding(pamelding.deltakerId)
    // .then() TODO Naviger tilbake
  }

  return (
    <>
      <Pamelding deltakerliste={pamelding.deltakerliste} mal={pamelding.mal}/>
      <Button variant="tertiary" size="small" className="my-2" onClick={avbrytPamelding}>
                Avbryt påmelding
      </Button>
      <Link to="/page1">Page 1</Link>
      <Link to="/page1">Page 2</Link>
    </>
  )
}

export default App
