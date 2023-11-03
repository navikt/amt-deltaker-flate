import useSWRImmutable from 'swr/immutable'
import { fetcher } from './api/api'
import { apiUrl } from './api/urls'
import { Pamelding } from './pamelding/Pamelding'
import { MAL_TYPE_ANNET } from './utils'

const Mikrofrontend = () => {
  const { data } = useSWRImmutable(apiUrl, fetcher)

  return (
    <div>
        data: {data}
      <h1>Påmelding {data && data?.emoji}</h1>
      <Pamelding
        deltakerlisteNavn="Oppfølging"
        arrangorNavn="Muligheter as"
        oppstartsType="Løpende"
        mal={[
          {
            visningsTekst: 'Intervjutrening',
            kode: '1',
            valgt: false,
            beskrivelse: null
          },
          {
            visningsTekst: 'Arbeidspraksis',
            kode: '2',
            valgt: true,
            beskrivelse: null
          },
          {
            visningsTekst: 'Annet:',
            kode: MAL_TYPE_ANNET,
            valgt: false,
            beskrivelse: null
          }
        ]}
      />
    </div>
  )
}

export default Mikrofrontend
