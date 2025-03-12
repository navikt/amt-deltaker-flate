import { useDeferredFetch } from 'deltaker-flate-common'
import { getDeltaker } from '../api/api.ts'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Alert } from '@navikt/ds-react'
import { DeltakerDetaljerHeader } from '../components/DeltakerDetaljerHeader.tsx'
import { DeltakerDetaljer } from '../components/DeltakerDetaljer.tsx'
import { Tilbakelenke } from '../components/Tilbakelenke.tsx'
import { Kontaktinformasjon } from '../components/Kontaktinformasjon.tsx'

export const DeltakerPage = () => {
  const { deltakerId } = useParams()
  const {
    data: deltaker,
    error,
    doFetch: fetchDeltaker
  } = useDeferredFetch(getDeltaker)

  useEffect(() => {
    if (deltakerId) {
      fetchDeltaker(deltakerId)
    }
  }, [deltakerId])

  return (
    <>
      <Tilbakelenke />

      {!deltakerId && <Alert variant="error">Noe gikk galt</Alert>}
      {error && <Alert variant="error">Noe gikk galt</Alert>}

      <DeltakerDetaljerHeader deltaker={deltaker} />
      <div className="flex justify-between p-10">
        <DeltakerDetaljer />
        <Kontaktinformasjon deltaker={deltaker} />
      </div>
    </>
  )
}
