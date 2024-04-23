import { Alert, BodyShort } from '@navikt/ds-react'
import { PrStatusInstillinger } from './PrStatusInstillinger'

interface Props {
  setDeltakerID?: (deltakerId: string) => void
}

const PrBanner = ({ setDeltakerID }: Props) => {
  return (
    <Alert variant="warning" className="mb-4" size="small">
      <BodyShort weight="semibold" size="small" className="mb-4">
        Dette er en pr-versjon av appen.
      </BodyShort>
      <PrStatusInstillinger setDeltakerID={setDeltakerID} />
    </Alert>
  )
}

export default PrBanner
