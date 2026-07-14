import { BodyShort, Heading } from '@navikt/ds-react'
import { Deltakelsesmengde, Tiltakskode } from '../model/deltaker'
import { formatDate } from '../utils/utils'
import { getDeltakelsesmengdeText } from './DeltakelsesmengdeVisning'

interface Props {
  tiltakskode: Tiltakskode
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  erEnkeltplass: boolean
  nesteDeltakelsesmengde: Deltakelsesmengde | null
}

export function DeltakelsesmengdeInfo({
  tiltakskode,
  deltakelsesprosent,
  dagerPerUke,
  erEnkeltplass,
  nesteDeltakelsesmengde
}: Props) {
  const deltakelsesmengdeText = getDeltakelsesmengdeText({
    tiltakskode,
    deltakelsesprosent,
    dagerPerUke,
    erEnkeltplass
  })

  const nesteDeltakelsesmengdeText = nesteDeltakelsesmengde
    ? getDeltakelsesmengdeText({
        tiltakskode,
        deltakelsesprosent: nesteDeltakelsesmengde.deltakelsesprosent,
        dagerPerUke: nesteDeltakelsesmengde.dagerPerUke,
        erEnkeltplass
      })
    : null

  if (!nesteDeltakelsesmengde && !deltakelsesmengdeText) {
    return null
  }
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
            {deltakelsesmengdeText || '(ikke satt)'}
          </BodyShort>
          <BodyShort size="small" className="mt-2">
            Neste periode (fom. {formatDate(nesteDeltakelsesmengde.gyldigFra)}
            ):
          </BodyShort>
          <BodyShort size="small">{nesteDeltakelsesmengdeText}</BodyShort>
        </>
      ) : (
        <BodyShort size="small" className="mt-2">
          {deltakelsesmengdeText}
        </BodyShort>
      )}
    </>
  )
}
