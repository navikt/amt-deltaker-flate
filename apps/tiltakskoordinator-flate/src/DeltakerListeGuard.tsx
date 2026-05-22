import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getDeltakerlisteDetaljer, getDeltakerStatusCounts } from './api/api'
import { DemoStatusInnstillinger } from './components/demo-banner/DemoStatusInnstillinger'
import { useAppContext } from './context-providers/AppContext'
import { DeltakerlisteContextProvider } from './context-providers/DeltakerlisteContext'
import { DeltakerlistePage } from './pages/DeltakerlistePage'
import { getFilterStatuser } from './utils/filter-deltakerliste'

export const DeltakerListeGuard = () => {
  const { deltakerlisteId } = useAppContext()

  const deltakerlisteDetaljerQuery = useQuery({
    queryKey: ['deltakerlisteDetaljer', deltakerlisteId],
    queryFn: () => getDeltakerlisteDetaljer(deltakerlisteId),
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

  const visFeilmelding =
    deltakerlisteDetaljerQuery.error ||
    (deltakerlisteDetaljerQuery.isSuccess && !deltakerlisteDetaljer)

  const filterCounts =
    typeof filterCountsQuery.data === 'string' || !filterCountsQuery.data
      ? { statusCounts: {}, handlingCounts: {} }
      : filterCountsQuery.data

  const filterCountsLaster =
    filterCountsQuery.isLoading && !filterCountsQuery.data

  const visFilterCountsFeil =
    !!filterCountsQuery.error || typeof filterCountsQuery.data === 'string'

  return (
    <>
      {deltakerlisteDetaljerQuery.isLoading && (
        <div className="flex justify-center items-center h-screen">
          <Loader size="3xlarge" title="Venter..." />
        </div>
      )}

      {visFeilmelding && (
        <div id="maincontent" role="main" tabIndex={-1}>
          <Alert variant="error" className="mt-4">
            <Heading spacing size="small" level="3">
              Kunne ikke hente detaljer om deltakerlisten. Vennligst prøv igjen.
            </Heading>
          </Alert>
        </div>
      )}

      {deltakerlisteDetaljer && (
        <DeltakerlisteContextProvider
          key={deltakerlisteDetaljer.id}
          initialDeltakerlisteDetaljer={deltakerlisteDetaljer}
          initialDeltakere={[]}
          initialStatusCounts={filterCounts.statusCounts}
          initialHandlingCounts={filterCounts.handlingCounts}
          initialFilterCountsLaster={filterCountsLaster}
        >
          {visFilterCountsFeil && (
            <div className="px-4 pt-4">
              <Alert variant="warning" size="small">
                Kunne ikke hente filtertellinger. Tellingene kan være
                ufullstendige.
              </Alert>
            </div>
          )}
          <DemoStatusInnstillinger />
          <DeltakerlistePage />
        </DeltakerlisteContextProvider>
      )}
    </>
  )
}
