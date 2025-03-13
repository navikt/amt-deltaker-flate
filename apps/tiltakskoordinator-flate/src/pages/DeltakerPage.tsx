import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { getDeltaker } from '../api/api.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Alert, Loader } from '@navikt/ds-react'
import { DeltakerDetaljerHeader } from '../components/DeltakerDetaljerHeader.tsx'
import { DeltakerDetaljer } from '../components/DeltakerDetaljer.tsx'
import { Tilbakelenke } from '../components/Tilbakelenke.tsx'
import { Kontaktinformasjon } from '../components/Kontaktinformasjon.tsx'
import { handterTilgangsFeil, isTilgangsFeil } from '../utils/tilgangsFeil.ts'
import { useAppContext } from '../context-providers/AppContext.tsx'
import { DeltakerDetaljer as DeltakerDetaljerDomene } from '../api/data/deltaker.ts'

export const DeltakerPage = () => {
  const { deltakerlisteId } = useAppContext()
  const { deltakerId } = useParams()
  const navigate = useNavigate()

  const {
    data: deltakerResponse,
    error,
    state,
    doFetch: fetchDeltaker
  } = useDeferredFetch(getDeltaker)

  document.title = 'Deltaker detaljer'
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus()
    }
  }, [])

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
      <h2 className="sr-only" tabIndex={-1} ref={headingRef}>
        Deltakerdetaljer
      </h2>

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

        <div className="flex flex-col justify-between pl-10 pr-10 pt-6 md:flex-row gap-6 md:gap-0">
          <DeltakerDetaljer deltaker={deltaker} />
          <Kontaktinformasjon deltaker={deltaker} />
        </div>
      </div>
    </>
  )
}
