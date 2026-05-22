import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getDeltakere,
  getDeltakerlisteDetaljer,
  getDeltakerStatusCounts
} from './api/api'
import { DemoStatusInnstillinger } from './components/demo-banner/DemoStatusInnstillinger'
import { useAppContext } from './context-providers/AppContext'
import { DeltakerlisteContextProvider } from './context-providers/DeltakerlisteContext'
import { DEFAULT_STATUS_FILTERS } from './context-providers/FilterContext'
import { DeltakerlistePage } from './pages/DeltakerlistePage'
import { getFilterStatuser } from './utils/filter-deltakerliste'
import { handterTilgangsFeil, isTilgangsFeil } from './utils/tilgangsFeil'

export const DeltakerListeGuard = () => {
  const { deltakerlisteId } = useAppContext()
  const navigate = useNavigate()

  const deltakerlisteDetaljerQuery = useQuery({
    queryKey: ['deltakerlisteDetaljer', deltakerlisteId],
    queryFn: () => getDeltakerlisteDetaljer(deltakerlisteId),
    enabled: deltakerlisteId.length > 0
  })

  const deltakereQuery = useQuery({
    queryKey: ['deltakereInit', deltakerlisteId],
    queryFn: () =>
      getDeltakere(deltakerlisteId, {
        statuser: DEFAULT_STATUS_FILTERS
      }),
    enabled: deltakerlisteId.length > 0
  })

  const statuserForVisning = useMemo(() => {
    if (!deltakerlisteDetaljerQuery.data) {
      return []
    }

    return [
      ...new Set(
        getFilterStatuser(
          deltakerlisteDetaljerQuery.data.oppstartstype,
          deltakerlisteDetaljerQuery.data.pameldingstype,
          deltakerlisteDetaljerQuery.data.tiltakskode
        )
      )
    ]
  }, [deltakerlisteDetaljerQuery.data])

  const filterCountsQuery = useQuery({
    queryKey: ['deltakerFilterCounts', deltakerlisteId, statuserForVisning],
    queryFn: () =>
      getDeltakerStatusCounts(deltakerlisteId, {
        statuser: statuserForVisning
      }),
    enabled: deltakerlisteId.length > 0 && statuserForVisning.length > 0
  })

  const deltakerlisteDetaljer = deltakerlisteDetaljerQuery.data
  const deltakereResponse = deltakereQuery.data

  if (deltakereResponse && isTilgangsFeil(deltakereResponse)) {
    handterTilgangsFeil(deltakereResponse, deltakerlisteId, navigate)
  }

  const visFeilmelding =
    deltakerlisteDetaljerQuery.error ||
    deltakereQuery.error ||
    (deltakerlisteDetaljerQuery.isSuccess && !deltakerlisteDetaljer) ||
    (deltakereQuery.isSuccess && !deltakereResponse)

  const deltakere =
    !deltakereResponse || isTilgangsFeil(deltakereResponse)
      ? null
      : deltakereResponse

  const filterCounts =
    typeof filterCountsQuery.data === 'string' || !filterCountsQuery.data
      ? { statusCounts: {}, handlingCounts: {} }
      : filterCountsQuery.data

  return (
    <>
      {(deltakerlisteDetaljerQuery.isLoading || deltakereQuery.isLoading) && (
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
          initialStatusCounts={filterCounts.statusCounts}
          initialHandlingCounts={filterCounts.handlingCounts}
        >
          <DemoStatusInnstillinger />
          <DeltakerlistePage />
        </DeltakerlisteContextProvider>
      )}
    </>
  )
}
