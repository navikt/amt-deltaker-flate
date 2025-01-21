import { Heading } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../DeltakerlisteContext'

export const DeltakerlisteTabell = () => {
  const { deltakere } = useDeltakerlisteContext()

  return (
    <div>
      <Heading size="small" level="2">
        liste
      </Heading>
      {deltakere.map((deltaker) => (
        <div key={deltaker.deltakerId}>{deltaker.deltakerId}</div>
      ))}
    </div>
  )
}
