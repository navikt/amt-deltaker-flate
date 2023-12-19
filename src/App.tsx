
import {Pamelding} from './pamelding/Pamelding'
import {useEffect, useState} from 'react'
import {PameldingResponse} from './api/data/pamelding.ts'
import {createPamelding, deletePamelding} from './api/api.ts'
import {Alert, Button} from '@navikt/ds-react'
import {useAppContext} from './AppContext.tsx'

const App = () => {
  const [pamelidng, setPamelding] = useState<PameldingResponse | undefined>(undefined)
  const {personident, deltakerlisteId, enhetId} = useAppContext()

  useEffect(() => {
    createPamelding(personident, deltakerlisteId, enhetId).then((data) => setPamelding(data))
  }, [])

  if (!pamelidng) {
    return <Alert variant="error">FEIL</Alert>
  }

  const avbrytPamelding = () => {
    // Hvis vi autolagerer i fremtiden vil vi ikke slette ved avbryt!
    deletePamelding(pamelidng.deltakerId).then(() => setPamelding(undefined))
    // .then() Naviger tilbake?
  }

  return (
    <>
      <Pamelding deltakerliste={pamelidng.deltakerliste} mal={pamelidng.mal} />
      <Button variant="tertiary" size="small" className="my-2" onClick={avbrytPamelding}>
          Avbryt påmelding
      </Button>
    </>
  )
}

export default App
