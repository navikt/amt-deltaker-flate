import { BodyShort, Label, Link } from '@navikt/ds-react'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import { ChevronLeftIcon } from '@navikt/aksel-icons'
import { getDeltakerlisteUrl } from '../navigation'

export const Tilbakelenke = () => {
  const { deltakerlisteId } = useParams()
  if (!deltakerlisteId) return null

  return (
    <BodyShort
      size="small"
      className="pl-4 pt-5 pb-5 font-[var(--a-font-weight-bold)]"
    >
      <Link as={ReactRouterLink} to={getDeltakerlisteUrl(deltakerlisteId)}>
        <ChevronLeftIcon className="h-auto w-[20px] mr-[-0.25rem]" />
        <Label as="span" size="small">
          Tilbake
        </Label>
      </Link>
    </BodyShort>
  )
}
