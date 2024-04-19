import { Alert, BodyLong, BodyShort } from '@navikt/ds-react'
import { useMock } from '../../utils/environment-utils'
import DemoStatusInstillinger from './DemoStatusInstillinger'
import { PrStatusInstillinger } from './PrStatusInstillinger'

interface Props {
  hasError?: boolean
  setDeltakerID?: (deltakerId: string) => void
}

const DemoBanner = ({ hasError, setDeltakerID }: Props) => {
  return (
    <Alert variant="warning" className="mb-4" size="small">
      <BodyShort weight="semibold" size="small">
        Dette er en demo-tjeneste
      </BodyShort>
      <BodyLong className="mt-1" size="small">
        Demoen inneholder ikke ekte data og kan til tider være ustabil.
      </BodyLong>
      {!hasError && useMock && <DemoStatusInstillinger />}
      {!hasError && <PrStatusInstillinger setDeltakerID={setDeltakerID} />}
    </Alert>
  )
}

export default DemoBanner
