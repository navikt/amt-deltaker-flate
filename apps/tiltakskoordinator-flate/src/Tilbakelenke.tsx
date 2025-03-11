import { BodyShort, Label, Link } from '@navikt/ds-react'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import { getDeltakerlisteUrl } from './navigation.ts'
import { ChevronLeftIcon } from '@navikt/aksel-icons'

export const Tilbakelenke = () => {
  const { deltakerlisteId } = useParams()
  if (!deltakerlisteId) return null

  return (
    <BodyShort size="small">
      <Link as={ReactRouterLink} to={getDeltakerlisteUrl(deltakerlisteId)}>
        <ChevronLeftIcon className="h-auto w-[20px]" />
        <Label as="span" size="small">
          Tilbake
        </Label>
      </Link>
    </BodyShort>
  )
}
