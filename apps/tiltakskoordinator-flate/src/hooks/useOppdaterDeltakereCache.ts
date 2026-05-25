import { useQueryClient } from '@tanstack/react-query'
import { DeltakereResponse } from '../api/api'
import { Deltaker } from '../api/data/deltakerliste'
import { useDeltakerlisteContext } from '../context-providers/DeltakerlisteContext'
import { isTilgangsFeil } from '../utils/tilgangsFeil'

/**
 * Returnerer en funksjon som oppdaterer deltakere i query-cachen for
 * gjeldende deltakerliste. Treffer alle filter-varianter via prefix-match.
 *
 * Tilgangsfeil-data hoppes over slik at vi ikke prøver å mutere
 * en streng-verdi som om den var et array.
 */
export const useOppdaterDeltakereCache = () => {
  const queryClient = useQueryClient()
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()

  return (oppdater: (deltakere: Deltaker[]) => Deltaker[]) => {
    queryClient.setQueriesData<DeltakereResponse>(
      { queryKey: ['deltakere', deltakerlisteDetaljer.id] },
      (gamleData) => {
        if (!gamleData || isTilgangsFeil(gamleData)) {
          return gamleData
        }
        return oppdater(gamleData)
      }
    )
  }
}
