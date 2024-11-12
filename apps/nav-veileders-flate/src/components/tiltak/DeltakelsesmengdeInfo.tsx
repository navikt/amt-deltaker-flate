import { BodyShort, Heading } from '@navikt/ds-react'
import { PameldingResponse } from '../../api/data/pamelding'
import { deltakerprosentText, formatDate } from 'deltaker-flate-common'

interface Props {
  deltaker: PameldingResponse
}

export function DeltakelsesmengdeInfo({ deltaker }: Props) {
  const nestePeriode = deltaker.deltakelsesmengder.nesteDeltakelsesmengde
  return (
    <>
      <Heading level="2" size="medium" className="mt-8">
        Deltakelsesmengde
      </Heading>
      {nestePeriode ? (
        <>
          <BodyShort size="small" className="mt-2">
            Nåværende periode:
          </BodyShort>
          <BodyShort size="small">
            {deltakerprosentText(
              deltaker.deltakelsesprosent,
              deltaker.dagerPerUke
            )}
          </BodyShort>
          <BodyShort size="small" className="mt-2">
            Neste periode (fom. {formatDate(nestePeriode.gyldigFra)}):
          </BodyShort>
          <BodyShort size="small">
            {deltakerprosentText(
              nestePeriode.deltakelsesprosent,
              nestePeriode.dagerPerUke
            )}
          </BodyShort>
        </>
      ) : (
        <BodyShort size="small" className="mt-2">
          {deltakerprosentText(
            deltaker.deltakelsesprosent,
            deltaker.dagerPerUke
          )}
        </BodyShort>
      )}
    </>
  )
}
