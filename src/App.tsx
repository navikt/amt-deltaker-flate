import {Pamelding} from './pamelding/Pamelding'
import {createPamelding, deletePamelding} from './api/api.ts'
import {Alert, Button, Heading, Loader} from '@navikt/ds-react'
import {useAppContext} from './AppContext.tsx'
import useFetch from './hooks/useFetch.ts'
import {AppLink} from './components/AppLink.tsx'
import {DELTAKELSE_PAGE, PAMELDING_PAGE} from './Routes.tsx'

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
      <Pamelding deltakerliste={pamelding.deltakerliste} mal={pamelding.mal} />
      <Button variant="tertiary" size="small" className="my-2" onClick={avbrytPamelding}>
        Avbryt påmelding
      </Button>
      <AppLink path={PAMELDING_PAGE}>Påmelding</AppLink>
      <AppLink path={DELTAKELSE_PAGE}>Deltakelse</AppLink>
    </>
  )
}

export default App
