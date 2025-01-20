import { Alert, BodyLong, BodyShort } from '@navikt/ds-react'

const DemoBanner = () => {
  return (
    <Alert variant="warning" className="mb-4" size="small">
      <BodyShort weight="semibold" size="small">
        Dette er en demo-tjeneste
      </BodyShort>
      <BodyLong className="mt-1" size="small">
        Demoen inneholder ikke ekte data og kan til tider være ustabil.
      </BodyLong>
    </Alert>
  )
}

export default DemoBanner
