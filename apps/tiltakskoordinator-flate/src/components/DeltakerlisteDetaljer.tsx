import { Heading } from '@navikt/ds-react'
import { useDeltakerlisteContext } from '../DeltakerlisteContext'

export const DeltakerlisteDetaljer = () => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()

  return (
    <div>
      <Heading size="small" level="2">
        info
      </Heading>
      <div>{deltakerlisteDetaljer.deltakerlisteId}</div>
    </div>
  )
}
