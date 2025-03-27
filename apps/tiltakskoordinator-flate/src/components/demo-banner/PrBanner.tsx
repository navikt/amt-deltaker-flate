import { Alert, BodyShort } from '@navikt/ds-react'
import { PrStatusInstillinger } from './PrStatusInstillinger'

interface Props {
  setDeltakerlisteId?: (deltakerlisteId: string) => void
}

const PrBanner = ({ setDeltakerlisteId }: Props) => {
  return (
    <Alert variant="warning" size="small" className="mb-6">
      <BodyShort weight="semibold" size="small" className="mb-4">
        Dette er en pr-versjon av appen.
      </BodyShort>
      <PrStatusInstillinger setDeltakerlisteId={setDeltakerlisteId} />
    </Alert>
  )
}

export default PrBanner
