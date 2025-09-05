import { BodyShort, Heading } from '@navikt/ds-react'
import { Deltakelsesmengde } from '../model/deltaker'
import { deltakerprosentText } from '../utils/displayText'
import { formatDate } from '../utils/utils'

interface Props {
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  nesteDeltakelsesmengde: Deltakelsesmengde | null
}

export function DeltakelsesmengdeInfo({
  deltakelsesprosent,
  dagerPerUke,
  nesteDeltakelsesmengde
}: Props) {
  return (
    <>
      <Heading level="2" size="medium" className="mt-8">
        Deltakelsesmengde
      </Heading>
      {nesteDeltakelsesmengde ? (
        <>
          <BodyShort size="small" className="mt-2">
            Nåværende periode:
          </BodyShort>
          <BodyShort size="small">
            {deltakerprosentText(deltakelsesprosent, dagerPerUke)}
          </BodyShort>
          <BodyShort size="small" className="mt-2">
            Neste periode (fom. {formatDate(nesteDeltakelsesmengde.gyldigFra)}):
          </BodyShort>
          <BodyShort size="small">
            {deltakerprosentText(
              nesteDeltakelsesmengde.deltakelsesprosent,
              nesteDeltakelsesmengde.dagerPerUke
            )}
          </BodyShort>
        </>
      ) : (
        <BodyShort size="small" className="mt-2">
          {deltakerprosentText(deltakelsesprosent, dagerPerUke)}
        </BodyShort>
      )}
    </>
  )
}
