import { Alert, Heading, Loader } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect } from 'react'
import { getDeltakere, getDeltakerlisteDetaljer, TilgangsFeil } from './api/api'
import { Deltakere } from './api/data/deltakerliste'
import { useAppContext } from './AppContext'
import { DeltakerlisteContextProvider } from './DeltakerlisteContext'
import { DeltakerlistePage } from './pages/DeltakerlistePage'
import { DeltakerlisteStengtPage } from './pages/DeltakerlisteStengtPage'
import { IkkeTilgangTilDeltakerlistePage } from './pages/IkkeTilgangTilDeltakerlistePage'
import { IngenAdGruppePage } from './pages/IngenAdGruppePage'

export const DeltakerListePageWrapper = () => {
  const { deltakerlisteId } = useAppContext()

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
    fetchDeltakerliste()
  }, [deltakerlisteId])

  if (deltakereResponse === TilgangsFeil.ManglerADGruppe) {
    return <IngenAdGruppePage />
  }

  if (deltakereResponse === TilgangsFeil.DeltakerlisteStengt) {
    return <DeltakerlisteStengtPage />
  }

  if (deltakereResponse === TilgangsFeil.IkkeTilgangTilDeltakerliste) {
    return (
      <IkkeTilgangTilDeltakerlistePage
        deltakerlisteId={deltakerlisteId!}
        onConfirm={fetchDeltakerliste}
      />
    )
  }

  const deltakere: Deltakere | null = deltakereResponse

  return (
    <>
      {(stateDeltakerlisteDetaljer === DeferredFetchState.LOADING ||
        stateDeltakere === DeferredFetchState.LOADING) && (
        <div
          id="maincontent"
          role="main"
          tabIndex={-1}
          className="flex justify-center items-center h-screen"
        >
          <Loader size="3xlarge" title="Venter..." />
        </div>
      )}

      {(errorDeltakerlisteDetaljer ||
        errorDeltakere ||
        (stateDeltakerlisteDetaljer === DeferredFetchState.RESOLVED &&
          !deltakerlisteDetaljer) ||
        (stateDeltakere === DeferredFetchState.RESOLVED &&
          !deltakereResponse)) && (
        <div id="maincontent" role="main" tabIndex={-1}>
          <Alert variant="error" className="mt-4">
            <Heading spacing size="small" level="3">
              Vi beklager, men noe gikk galt
            </Heading>
          </Alert>
        </div>
      )}

      {deltakerlisteDetaljer && deltakere && (
        <DeltakerlisteContextProvider
          initialDeltakerlisteDetaljer={deltakerlisteDetaljer}
          initialDeltakere={deltakere}
        >
          <DeltakerlistePage />
        </DeltakerlisteContextProvider>
      )}
    </>
  )
}
