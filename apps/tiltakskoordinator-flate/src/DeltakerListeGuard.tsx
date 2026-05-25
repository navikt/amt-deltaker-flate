import { Alert, Heading, Loader } from '@navikt/ds-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getDeltakerlisteDetaljer, getDeltakerStatusCounts } from './api/api'
import { DemoStatusInnstillinger } from './components/demo-banner/DemoStatusInnstillinger'
import { useAppContext } from './context-providers/AppContext'
import { DeltakerlisteContextProvider } from './context-providers/DeltakerlisteContext'
import { FilterContextProvider } from './context-providers/FilterContext'
import { FILTER_COUNTS_QUERY_KEY } from './api/tanstack-query-keys'
import { DeltakerlistePage } from './pages/DeltakerlistePage'
import {
  getDefaultStatusFilter,
  getFilterStatuser
} from './utils/filter-deltakerliste'

/**
 * Henter data som trengs før deltakerliste-siden kan vises,
 * og setter opp context-providers med initialverdier.
 *
 * Viser loader mens data hentes, feilmelding ved feil,
 * og renderer DeltakerlistePage når alt er klart.
 */
export const DeltakerListeGuard = () => {
  const { deltakerlisteId } = useAppContext()

  const deltakerlisteDetaljerQuery = useQuery({
    queryKey: ['deltakerlisteDetaljer', deltakerlisteId],
    queryFn: () => getDeltakerlisteDetaljer(deltakerlisteId),
    enabled: deltakerlisteId.length > 0
  })

  // Beregn hvilke statuser som er relevante for denne deltakerlistens
  // oppstartstype/påmeldingstype – brukes som parameter til filterCounts-kallet
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

  // Henter antall deltakere per status/handling – vises i filterpanelet
  const filterCountsQuery = useQuery({
    queryKey: [FILTER_COUNTS_QUERY_KEY, deltakerlisteId, statuserForVisning],
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

  // Antall deltakere per status og handling – brukes til å vise tellinger i filterpanelet.
  // Ved tilgangsfeil returnerer API-kallet en TilgangsFeil-string, da faller vi tilbake til tomme objekter.
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
        <FilterContextProvider
          key={deltakerlisteDetaljer.id}
          initialStatusFilter={getDefaultStatusFilter(
            deltakerlisteDetaljer.pameldingstype
          )}
        >
          <DeltakerlisteContextProvider
            key={deltakerlisteDetaljer.id}
            initialDeltakerlisteDetaljer={deltakerlisteDetaljer}
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
        </FilterContextProvider>
      )}
    </>
  )
}
