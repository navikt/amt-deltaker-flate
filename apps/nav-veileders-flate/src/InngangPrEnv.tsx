// Only for pull request env

import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Loader,
  Switch,
  TextField
} from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useState } from 'react'
import { createPamelding, getPamelding } from './api/api.ts'
import { PameldingContextProvider } from './components/tiltak/PameldingContext.tsx'
import { DeltakerGuard } from './guards/DeltakerGuard.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'

const InngangPrEnv = () => {
  const [personident, setPersonident] = useState('29847595971')
  const [deltakerlisteId, setDeltakerlisteId] = useState(
    'b3e1cfbb-bfb5-4b4b-b8a4-af837631ed51'
  )
  const [deltakerId, setDeltakerId] = useState(
    'a884bd75-0cd3-4db0-a84f-cce526f46f70'
  )
  const [lagNyPamelding, setLagNyPamelding] = useState(false)

  if (deltakerlisteId === undefined) {
    return <ErrorPage />
  }

  const {
    data: nyPamelding,
    state: stateCreate,
    error: errorCreate,
    doFetch: doCreatePamelding
  } = useDeferredFetch(createPamelding)

  const {
    data: pamelding,
    state: stateHent,
    error: errorHent,
    doFetch: doFetchPamelding
  } = useDeferredFetch(getPamelding)

  return (
    <>
      <Alert variant="warning" className="mb-4" size="small">
        <BodyShort weight="semibold" size="small" className="mb-2">
          Denne appen kjører i pr-modus i dev (Q2)
        </BodyShort>

        <BodyLong size="small" className="mb-4">
          Feltene er forhandsutfylt for å hente en deltakelse for Egoistisk
          Maktperson.
        </BodyLong>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (lagNyPamelding && personident && deltakerlisteId) {
              doCreatePamelding(personident, deltakerlisteId, '0315')
            }
            if (!lagNyPamelding && deltakerId && personident) {
              doFetchPamelding(deltakerId, personident, '0315')
            }
          }}
        >
          <Switch
            size="small"
            checked={lagNyPamelding}
            onChange={(e) => setLagNyPamelding(e.target.checked)}
          >
            Lag ny påmelding
          </Switch>
          <TextField
            label="Personident (fødselsnummer etc)"
            type="number"
            size="small"
            className="mt-2"
            value={personident}
            onChange={(e) => setPersonident(e.target.value)}
          />
          {lagNyPamelding ? (
            <TextField
              label="Deltakerliste id"
              size="small"
              className="mt-2"
              value={deltakerlisteId}
              onChange={(e) => setDeltakerlisteId(e.target.value)}
            />
          ) : (
            <TextField
              label="Deltaker-id"
              size="small"
              className="mt-2"
              value={deltakerId}
              onChange={(e) => setDeltakerId(e.target.value)}
            />
          )}

          <Button className="mt-2">Bruk</Button>
        </form>
      </Alert>

      {((lagNyPamelding && stateCreate === DeferredFetchState.LOADING) ||
        (!lagNyPamelding && stateHent === DeferredFetchState.LOADING)) && (
        <div className="flex justify-center items-center">
          <Loader size="3xlarge" title="Venter..." />
        </div>
      )}

      {(lagNyPamelding && (errorCreate || !nyPamelding)) ||
        (!lagNyPamelding && (errorHent || !pamelding) && (
          <ErrorPage message="Feil med henting av deltaker" />
        ))}

      {lagNyPamelding && nyPamelding && (
        <PameldingContextProvider initialPamelding={nyPamelding}>
          <DeltakerGuard />
        </PameldingContextProvider>
      )}
      {!lagNyPamelding && pamelding && (
        <PameldingContextProvider initialPamelding={pamelding}>
          <DeltakerGuard />
        </PameldingContextProvider>
      )}
    </>
  )
}

export default InngangPrEnv
