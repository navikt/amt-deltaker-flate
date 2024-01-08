import {useAppContext} from '../AppContext.tsx'
import useFetch from '../hooks/useFetch.ts'
import {createPamelding} from '../api/api.ts'
import {Alert, Heading, Loader} from '@navikt/ds-react'
import {DeltakerStatusType} from '../api/data/pamelding.ts'
import {OpprettPameldingPage} from '../pages/OpprettPameldingPage.tsx'

export const MeldPaOrRedigerGuard = () => {
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

  if (pamelding.status.type === DeltakerStatusType.KLADD) {
    return <OpprettPameldingPage pamelding={pamelding}/>
    // return <Pamelding deltakerliste={pamelding.deltakerliste} mal={pamelding.mal}/>
  }

  return (
    <div>
      <h1>Rediger påmelding er ikke implementert enda</h1>
    </div>
  )
}
