import { Pamelding } from './pamelding/Pamelding'
import { useEffect, useState } from 'react'
import { PameldingResponse } from './api/data/pamelding.ts'
import { createPamelding } from './api/api.ts'
import { Button } from '@navikt/ds-react'

const App = () => {
  const [pamelidng, setPamelding] = useState<PameldingResponse | undefined>(undefined)

  useEffect(() => {
    createPamelding({
      deltakerlisteId: '6b6578eb-eae0-4ad7-8a69-79db3cea4f64',
      personident: '12345678901'
    }).then((data) => setPamelding(data))
  }, [])

  if (pamelidng === undefined) return <div>Ikke lastet</div>

  return (
    <>
      <Pamelding
        deltakerlisteNavn={pamelidng.deltakerliste.deltakerlisteNavn}
        arrangorNavn={pamelidng.deltakerliste.arrangorNavn}
        oppstartsType={pamelidng.deltakerliste.oppstartstype}
        mal={pamelidng.deltakerliste.mal}
      />
      <Button variant="tertiary" size="small">
        Avbryt påmelding
      </Button>
    </>
  )
}

export default App
