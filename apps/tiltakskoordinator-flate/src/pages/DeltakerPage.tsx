import { Alert, Loader } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDeltaker } from '../api/api.ts'
import { DeltakerDetaljer as DeltakerDetaljerDomene } from '../api/data/deltaker.ts'
import { DeltakerDetaljer } from '../components/DeltakerDetaljer.tsx'
import { DeltakerDetaljerHeader } from '../components/DeltakerDetaljerHeader.tsx'
import { Kontaktinformasjon } from '../components/Kontaktinformasjon.tsx'
import { Tilbakelenke } from '../components/Tilbakelenke.tsx'
import { useAppContext } from '../context-providers/AppContext.tsx'
import { useFocusPageLoad } from '../hooks/useFocusPageLoad.tsx'
import { handterTilgangsFeil, isTilgangsFeil } from '../utils/tilgangsFeil.ts'

export const DeltakerPage = () => {
  const { ref } = useFocusPageLoad('Deltaker detaljer')
  const { deltakerlisteId } = useAppContext()
  const { deltakerId } = useParams()
  const navigate = useNavigate()

  const {
    data: deltakerResponse,
    error,
    state,
    doFetch: fetchDeltaker
  } = useDeferredFetch(getDeltaker)

  useEffect(() => {
    if (deltakerId) {
      fetchDeltaker(deltakerId)
    }
  }, [deltakerId])

  if (isTilgangsFeil(deltakerResponse)) {
    handterTilgangsFeil(deltakerResponse, deltakerlisteId, navigate)
  }

  const deltaker = deltakerResponse as DeltakerDetaljerDomene | null

  return (
    <>
      <Tilbakelenke />
      <h2 className="sr-only" tabIndex={-1} ref={ref}>
        Deltakerdetaljer
      </h2>

      <Alert variant="info" size="small" className="ml-8 mr-8 mb-6">
        Denne siden er under arbeid. Deltakers kontaktinformasjon og
        opplysninger om Nav-veileder vil komme etterhvert.
      </Alert>

      {state === DeferredFetchState.LOADING && (
        <div className="flex justify-center mt-10">
          <Loader size="3xlarge" title="Venter..." />
        </div>
      )}

      <div aria-live="polite">
        {(!deltakerId ||
          error ||
          (state === DeferredFetchState.RESOLVED && !deltaker)) && (
          <Alert variant="error">
            Kunne ikke finne deltaker. Vennligst prøv igjen.
          </Alert>
        )}

        <DeltakerDetaljerHeader deltaker={deltaker} />

        <div className="flex flex-col justify-between pl-10 pr-10 pt-6 md:flex-row gap-6">
          <DeltakerDetaljer deltaker={deltaker} />
          <Kontaktinformasjon deltaker={deltaker} />
        </div>
      </div>
    </>
  )
}
