import { Alert, Heading, Loader } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDeltakere, getDeltakerlisteDetaljer } from './api/api'
import { Deltakere } from './api/data/deltakerliste'
import { DemoStatusInnstillinger } from './components/demo-banner/DemoStatusInnstillinger'
import { useAppContext } from './context-providers/AppContext'
import { DeltakerlisteContextProvider } from './context-providers/DeltakerlisteContext'
import { DeltakerlistePage } from './pages/DeltakerlistePage'
import { handterTilgangsFeil, isTilgangsFeil } from './utils/tilgangsFeil'

export const DeltakerListeGuard = () => {
  const { deltakerlisteId } = useAppContext()
  const navigate = useNavigate()

  const {
    data: deltakerlisteDetaljer,
    state: stateDeltakerlisteDetaljer,
    error: errorDeltakerlisteDetaljer,
    doFetch: doFetchDeltakelisteDetaljer
  } = useDeferredFetch(getDeltakerlisteDetaljer)

  const {
    data: deltakereResponse,
    state: stateDeltakere,
    error: errorDeltakere,
    doFetch: doFetchDeltakere
  } = useDeferredFetch(getDeltakere)

  const fetchDeltakerliste = () => {
    doFetchDeltakere(deltakerlisteId)
    doFetchDeltakelisteDetaljer(deltakerlisteId)
  }

  useEffect(() => {
    if (deltakerlisteId.length > 0) {
      fetchDeltakerliste()
    }
  }, [deltakerlisteId])

  if (isTilgangsFeil(deltakereResponse)) {
    handterTilgangsFeil(deltakereResponse, deltakerlisteId, navigate)
  }

  const visFeilmelding =
    errorDeltakerlisteDetaljer ||
    errorDeltakere ||
    (stateDeltakerlisteDetaljer === DeferredFetchState.RESOLVED &&
      !deltakerlisteDetaljer) ||
    (stateDeltakere === DeferredFetchState.RESOLVED && !deltakereResponse)

  const deltakere: Deltakere | null = deltakereResponse as Deltakere | null

  return (
    <>
      {(stateDeltakerlisteDetaljer === DeferredFetchState.LOADING ||
        stateDeltakere === DeferredFetchState.LOADING) && (
        <div className="flex justify-center items-center h-screen">
          <Loader size="3xlarge" title="Venter..." />
        </div>
      )}

      {visFeilmelding && (
        <div id="maincontent" role="main" tabIndex={-1}>
          <Alert variant="error" className="mt-4">
            <Heading spacing size="small" level="3">
              Kunne ikke hente deltakere. Vennligst prøv igjen.
            </Heading>
          </Alert>
        </div>
      )}

      {deltakerlisteDetaljer && deltakere && (
        <DeltakerlisteContextProvider
          initialDeltakerlisteDetaljer={deltakerlisteDetaljer}
          initialDeltakere={deltakere}
        >
          <DemoStatusInnstillinger />
          <DeltakerlistePage />
        </DeltakerlisteContextProvider>
      )}
    </>
  )
}
