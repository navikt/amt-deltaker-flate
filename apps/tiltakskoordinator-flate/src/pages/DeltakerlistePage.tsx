import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Alert, Loader } from '@navikt/ds-react'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDeltakere } from '../api/api'
import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/deltaker-liste-tabell/DeltakerlisteTabell'
import { FilterDeltakerliste } from '../components/filter-deltakerliste/FilterDeltakerliste'
import { useAppContext } from '../context-providers/AppContext'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext'
import { useFilterContext } from '../context-providers/FilterContext'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'
import { useSorteringContext } from '../context-providers/SorteringContext'
import {
  HandlingFilterValg,
  STATUS_FILTER_TYPER
} from '../utils/filter-deltakerliste'
import { handterTilgangsFeil, isTilgangsFeil } from '../utils/tilgangsFeil'

export const DeltakerlistePage = () => {
  const { ref } = useFocusPageLoad('Deltakerliste')
  const { deltakerlisteId } = useAppContext()
  const navigate = useNavigate()
  const { valgteHendelseFilter, valgteStatusFilter } = useFilterContext()
  const { deltakerlisteDetaljer, setDeltakere } = useDeltakerlisteContext()
  const { setLagretSorteringsValg } = useSorteringContext()

  const erForsteRender = useRef(true)

  const normaliserteStatuser = useMemo(
    () =>
      STATUS_FILTER_TYPER.filter((status) =>
        valgteStatusFilter.includes(status)
      ),
    [valgteStatusFilter]
  )

  const request = useMemo(
    () => ({
      harForslagFraArrangor: valgteHendelseFilter.includes(
        HandlingFilterValg.AktiveForslag
      ),
      statuser: normaliserteStatuser
    }),
    [valgteHendelseFilter, normaliserteStatuser]
  )

  useEffect(() => {
    if (erForsteRender.current) {
      erForsteRender.current = false
      return
    }
    setLagretSorteringsValg(undefined)
  }, [valgteHendelseFilter, valgteStatusFilter, setLagretSorteringsValg])

  const {
    data: deltakereResponse,
    isPending,
    isFetching,
    isPlaceholderData,
    error
  } = useQuery({
    queryKey: [
      'deltakere',
      deltakerlisteDetaljer.id,
      request.harForslagFraArrangor,
      request.statuser
    ],
    queryFn: async () => getDeltakere(deltakerlisteDetaljer.id, request),
    staleTime: 0,
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    if (
      !isPlaceholderData &&
      deltakereResponse &&
      !isTilgangsFeil(deltakereResponse)
    ) {
      setDeltakere(deltakereResponse)
    }
  }, [deltakereResponse, isPlaceholderData, setDeltakere])

  useEffect(() => {
    if (deltakereResponse && isTilgangsFeil(deltakereResponse)) {
      handterTilgangsFeil(deltakereResponse, deltakerlisteId, navigate)
    }
  }, [deltakereResponse, deltakerlisteId, navigate])

  return (
    <div className="flex flex-wrap p-4 pt-0" data-testid="page_deltakerliste">
      <div className="flex flex-col max-w-[20rem] ax-md:max-w-60 mr-0 ax-md:mr-8">
        <h2 className="sr-only" tabIndex={-1} ref={ref}>
          Deltakerliste - detaljer
        </h2>
        <DeltakerlisteDetaljer />
        <FilterDeltakerliste className="mt-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="sr-only">Deltakerliste</h2>
        {error && (
          <Alert variant="error" size="small" className="mt-4">
            Kunne ikke hente deltakere. Prøv igjen senere.
          </Alert>
        )}
        {isPending && (
          <Loader
            size="small"
            title="Laster deltakere..."
            className="mt-4 mb-2"
          />
        )}
        {!isPending && (
          <div
            className={
              isFetching ? 'opacity-50 transition-opacity duration-150' : ''
            }
          >
            <DeltakerlisteTabell />
          </div>
        )}
      </div>
    </div>
  )
}
