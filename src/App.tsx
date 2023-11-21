import { Pamelding } from './pamelding/Pamelding'
import { MAL_TYPE_ANNET } from './utils'
import { useEffect, useState } from 'react'
import { PameldingResponse } from './api/data/pamelding.ts'
import { createPamelding } from './api/api.ts'

const App = () => {
  const [info, setInfo] = useState<PameldingResponse | undefined>(undefined)

  useEffect(() => {
    createPamelding({
      deltakerlisteId: '6b6578eb-eae0-4ad7-8a69-79db3cea4f64',
      personident: '12345678901'
    })
      .then(data => setInfo(data))
  }, [])

  if (info === undefined) return (<div>Ikke lastet</div>)

  return (
    <div>
      <h1>Påmelding</h1>
      <Pamelding
        deltakerlisteNavn="Oppfølging"
        arrangorNavn="Muligheter as"
        oppstartsType="Løpende"
        mal={[
          {
            visningsTekst: 'Intervjutrening',
            type: '1',
            valgt: false,
            beskrivelse: null
          },
          {
            visningsTekst: 'Arbeidspraksis',
            type: '2',
            valgt: true,
            beskrivelse: null
          },
          {
            visningsTekst: 'Annet:',
            type: MAL_TYPE_ANNET,
            valgt: false,
            beskrivelse: null
          }
        ]}
      />
    </div>
  )
}

export default App
