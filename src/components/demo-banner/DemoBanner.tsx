import { Alert, BodyLong, BodyShort } from '@navikt/ds-react'
import DemoDeltakerInstillinger from './DemoDeltakerInstillinger'
import { useMock } from '../../utils/environment-utils'
import DemoStatusInstillinger from './DemoStatusInstillinger'

interface Props {
  hasError?: boolean
}

const DemoBanner = ({ hasError }: Props) => {
  return (
    <Alert variant="warning" className="mb-4" size="small">
      <BodyShort weight="semibold" size="small">
        Dette er en demo-tjeneste
      </BodyShort>

      <BodyLong className="mt-1" size="small">
        Demoen inneholder ikke ekte data og kan til tider være ustabil.
      </BodyLong>

      {hasError && <DemoDeltakerInstillinger />}
      {!hasError && useMock && <DemoStatusInstillinger />}
      {!hasError && !useMock && <DemoDeltakerInstillinger />}
    </Alert>
  )
}

export default DemoBanner
