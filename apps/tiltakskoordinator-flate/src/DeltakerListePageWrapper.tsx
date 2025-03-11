import { Alert, Heading, Loader } from '@navikt/ds-react'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDeltakere, getDeltakerlisteDetaljer, TilgangsFeil } from './api/api'
import DemoBanner from './components/demo-banner/DemoBanner'
import PrBanner from './components/demo-banner/PrBanner'
import { DeltakerlisteContextProvider } from './DeltakerlisteContext'
import { isPrEnv, useMock } from './utils/environment-utils'
import { DeltakerlistePage } from './pages/DeltakerlistePage'
import { Deltakere } from './api/data/deltakerliste'
import { IngenAdGruppePage } from './pages/IngenAdGruppePage'
import { IkkeTilgangTilDeltakerlistePage } from './pages/IkkeTilgangTilDeltakerlistePage'
import { DeltakerlisteStengtPage } from './pages/DeltakerlisteStengtPage'

dayjs.locale(nb)

export const DeltakerListePageWrapper = () => {
  const deltakerlisteIdFraUrl = useParams().deltakerlisteId
  const [deltakerlisteIdPrSetting, setDeltakerlisteIDprSetting] = useState('')

  const deltakerlisteId = isPrEnv
    ? deltakerlisteIdPrSetting
    : deltakerlisteIdFraUrl

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
    if (deltakerlisteId) {
      doFetchDeltakere(deltakerlisteId)
      doFetchDeltakelisteDetaljer(deltakerlisteId)
    }
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
      {isPrEnv && <PrBanner setDeltakerlisteId={setDeltakerlisteIDprSetting} />}
      {useMock && <DemoBanner />}

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
