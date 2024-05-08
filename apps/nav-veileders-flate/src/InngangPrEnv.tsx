// Only for pull request env

import { Alert, BodyShort, Button, Loader, TextField } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useState } from 'react'
import { createPamelding } from './api/api.ts'
import { PameldingContextProvider } from './components/tiltak/PameldingContext.tsx'
import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'

const InngangPrEnv = () => {
  const [personident, setPersonident] = useState('')
  const [enhetId, setEnhetId] = useState('')
  const [deltakerlisteId, setDeltakerlisteId] = useState('')

  if (deltakerlisteId === undefined) {
    return <ErrorPage />
  }

  const {
    data: nyPamelding,
    state,
    error,
    doFetch: doFetchPamelding
  } = useDeferredFetch(createPamelding)

  return (
    <>
      <Alert variant="warning" className="mb-4" size="small">
        <BodyShort weight="semibold" size="small" className="mb-4">
          Denne appen kjører i pr-modus i dev (Q2)
        </BodyShort>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (personident && deltakerlisteId && enhetId) {
              doFetchPamelding(personident, deltakerlisteId, enhetId)
            }
          }}
        >
          <TextField
            label="Personident (fødselsnummer etc)"
            type="number"
            size="small"
            className="mt-2"
            value={personident}
            onChange={(e) => setPersonident(e.target.value)}
          />

          <TextField
            label="Enhet id"
            size="small"
            className="mt-2"
            value={enhetId}
            onChange={(e) => setEnhetId(e.target.value)}
          />

          <TextField
            label="Deltakerliste id"
            size="small"
            className="mt-2"
            value={deltakerlisteId}
            onChange={(e) => setDeltakerlisteId(e.target.value)}
          />
          <Button className="mt-2">Bruk</Button>
        </form>
      </Alert>

      {state === DeferredFetchState.LOADING && (
        <div className="flex justify-center items-center">
          <Loader size="3xlarge" title="Venter..." />
        </div>
      )}

      {(error || !nyPamelding) && <ErrorPage message={error} />}

      {nyPamelding && (
        <PameldingContextProvider initialPamelding={nyPamelding}>
          <DeltakerGuard />
        </PameldingContextProvider>
      )}
    </>
  )
}

export default InngangPrEnv
