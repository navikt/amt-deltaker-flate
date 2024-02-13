import { Alert, BodyLong, BodyShort } from '@navikt/ds-react'
import DemoDeltakerInstillinger from './DemoDeltakerInstillinger'

const DemoBanner = () => {
  return (
    <Alert variant="warning" className="mb-4" size="small">
      <BodyShort weight="semibold" size="small">
        Dette er en demo-tjeneste
      </BodyShort>

      <BodyLong className="mt-1" size="small">
        Demoen inneholder ikke ekte data og kan til tider være ustabil.
      </BodyLong>

      <DemoDeltakerInstillinger className="mt-1" />
    </Alert>
  )
}

export default DemoBanner
