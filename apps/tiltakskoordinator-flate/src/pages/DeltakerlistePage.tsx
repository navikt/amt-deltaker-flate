import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Alert, Loader } from '@navikt/ds-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDeltakere } from '../api/api'
import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/deltaker-liste-tabell/DeltakerlisteTabell'
import { FilterDeltakerliste } from '../components/filter-deltakerliste/FilterDeltakerliste'
import { useAppContext } from '../context-providers/AppContext'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext'
import {
  DEFAULT_STATUS_FILTERS,
  useFilterContext
} from '../context-providers/FilterContext'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad'
import { HandlingFilterValg } from '../utils/filter-deltakerliste'
import { handterTilgangsFeil, isTilgangsFeil } from '../utils/tilgangsFeil'

export const DeltakerlistePage = () => {
  const { ref } = useFocusPageLoad('Deltakerliste')
  const { deltakerlisteId } = useAppContext()
  const navigate = useNavigate()
  const { valgteHendelseFilter, valgteStatusFilter } = useFilterContext()
  const { deltakerlisteDetaljer, deltakere, setDeltakere } =
    useDeltakerlisteContext()

  const request = useMemo(
    () => ({
      harForslagFraArrangor: valgteHendelseFilter.includes(
        HandlingFilterValg.AktiveForslag
      ),
      statuser: valgteStatusFilter
    }),
    [valgteHendelseFilter, valgteStatusFilter]
  )

  const harDefaultStatuser =
    valgteStatusFilter.length === DEFAULT_STATUS_FILTERS.length &&
    DEFAULT_STATUS_FILTERS.every((status) =>
      valgteStatusFilter.includes(status)
    )

  const erInitialtFiltervalg =
    !request.harForslagFraArrangor && harDefaultStatuser

  const {
    data: deltakereResponse,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      'deltakere',
      deltakerlisteDetaljer.id,
      request.harForslagFraArrangor,
      request.statuser
    ],
    queryFn: () => getDeltakere(deltakerlisteDetaljer.id, request),
    initialData: erInitialtFiltervalg ? deltakere : undefined,
    staleTime: 60 * 1000, // 1 minutt
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    if (!deltakereResponse) {
      return
    }

    if (isTilgangsFeil(deltakereResponse)) {
      handterTilgangsFeil(deltakereResponse, deltakerlisteId, navigate)
      return
    }

    setDeltakere(deltakereResponse)
  }, [deltakereResponse, deltakerlisteId, navigate, setDeltakere])

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
        {isFetching && (
          <Loader
            size="small"
            title="Laster deltakere..."
            className="mt-4 mb-2"
          />
        )}
        <DeltakerlisteTabell />
      </div>
    </div>
  )
}
