import { Pamelding } from './pamelding/Pamelding'
import { useEffect, useState } from 'react'
import { PameldingResponse } from './api/data/pamelding.ts'
import { createPamelding, deletePamelding } from './api/api.ts'
import { Button } from '@navikt/ds-react'
import { useDeltakerIdent } from './hooks/useDeltakerIdent.ts'

const App = () => {
  const [pamelidng, setPamelding] = useState<PameldingResponse | undefined>(undefined)
  const deltakerIdent = useDeltakerIdent()

  useEffect(() => {
    createPamelding(deltakerIdent).then((data) => setPamelding(data))
  }, [])

  if (pamelidng === undefined) return <div>Vi kunne ikke opprette påmelding.</div>

  const avbrytPamelding = () => {
    // Hvis vi autolagerer i fremtiden vil vi ikke slette ved avbryt!
    deletePamelding(pamelidng.deltakerId).then(() => setPamelding(undefined))
    // .then() Naviger tilbake?
  }

  return (
    <>
      <Pamelding deltakerliste={pamelidng.deltakerliste} mal={pamelidng.mal}/>
      <Button variant="tertiary" size="small" className="my-2" onClick={avbrytPamelding}>
        Avbryt påmelding
      </Button>
    </>
  )
}

export default App
