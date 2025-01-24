import { Alert, BodyShort } from '@navikt/ds-react'
import { PrStatusInstillinger } from './PrStatusInstillinger'

interface Props {
  setDeltakerlisteId?: (deltkerlisteId: string) => void
}

const PrBanner = ({ setDeltakerlisteId }: Props) => {
  return (
    <Alert variant="warning" size="small">
      <BodyShort weight="semibold" size="small" className="mb-4">
        Dette er en pr-versjon av appen.
      </BodyShort>
      <PrStatusInstillinger setDeltakerlisteId={setDeltakerlisteId} />
    </Alert>
  )
}

export default PrBanner
