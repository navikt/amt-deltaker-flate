import { useDeferredFetch } from 'deltaker-flate-common'
import { getDeltaker } from '../api/api.ts'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Alert } from '@navikt/ds-react'
import { DeltakerDetaljerHeader } from '../DeltakerDetaljerHeader.tsx'
import { DeltakerDetaljer } from '../DeltakerDetaljer.tsx'
import { Tilbakelenke } from '../Tilbakelenke.tsx'

export const DeltakerPage = () => {
  const { deltakerId } = useParams()
  const { error, doFetch: fetchDeltaker } = useDeferredFetch(getDeltaker)

  useEffect(() => {
    if (deltakerId) {
      fetchDeltaker(deltakerId)
    }
  }, [deltakerId])

  return (
    <>
      <Tilbakelenke />
      <DeltakerDetaljerHeader />
      <DeltakerDetaljer />
      {!deltakerId && <Alert variant="error">Noe gikk galt</Alert>}
      {error && <Alert variant="error">Noe gikk galt</Alert>}
    </>
  )
}
