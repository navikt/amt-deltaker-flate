import { useDeferredFetch } from 'deltaker-flate-common'
import { getDeltaker } from '../api/api.ts'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Alert, BodyShort, Link } from '@navikt/ds-react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { getDeltakerlisteUrl } from '../navigation.ts'

export const DeltakerPage = () => {
  const { deltakerId, deltakerlisteId } = useParams()
  const { error, doFetch: fetchDeltaker } = useDeferredFetch(getDeltaker)

  useEffect(() => {
    if (deltakerId) {
      fetchDeltaker(deltakerId)
    }
  }, [deltakerId])

  if (!deltakerlisteId) return <Alert variant="error">Mangler deltaker</Alert>
  return (
    <>
      <BodyShort size="small">
        <Link as={ReactRouterLink} to={getDeltakerlisteUrl(deltakerlisteId)}>
          Tilbake
        </Link>
      </BodyShort>
      <div>Velkommen til deltakersiden</div>
      {!deltakerId && <Alert variant="error">Noe gikk galt</Alert>}
      {error && <Alert variant="error">Noe gikk galt</Alert>}
    </>
  )
}
