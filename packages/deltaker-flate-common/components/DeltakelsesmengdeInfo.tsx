import { BodyShort, Heading } from '@navikt/ds-react'
import { Deltakelsesmengde, Tiltakskode } from '../model/deltaker'
import { formatDate } from '../utils/utils'
import { deltakerprosentText } from '../utils/displayText'
import { harDeltakelsesmengde } from '../utils/utils'

interface Props {
  tiltakskode: Tiltakskode
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  erEnkeltplass: boolean
  nesteDeltakelsesmengde?: Deltakelsesmengde | null
  className?: string
  headingLevel?: '2' | '3'
  headingSize?: 'medium' | 'small'
}

export const getDeltakelsesmengdeText = (
  tiltakskode: Tiltakskode,
  erEnkeltplass: boolean,
  deltakelsesprosent: number | null,
  dagerPerUke: number | null
) => {
  if (!harDeltakelsesmengde({ tiltakskode, erEnkeltplass })) {
    return null
  }
  return deltakerprosentText(deltakelsesprosent, dagerPerUke, erEnkeltplass)
}

export function DeltakelsesmengdeInfo({
  tiltakskode,
  deltakelsesprosent,
  dagerPerUke,
  erEnkeltplass,
  nesteDeltakelsesmengde,
  className,
  headingLevel = '2',
  headingSize = 'medium'
}: Props) {
  const deltakelsesmengdeText = getDeltakelsesmengdeText(
    tiltakskode,
    erEnkeltplass,
    deltakelsesprosent,
    dagerPerUke
  )

  const nesteDeltakelsesmengdeText = nesteDeltakelsesmengde
    ? getDeltakelsesmengdeText(
        tiltakskode,
        erEnkeltplass,
        nesteDeltakelsesmengde.deltakelsesprosent,
        nesteDeltakelsesmengde.dagerPerUke
      )
    : null

  if (!deltakelsesmengdeText && !nesteDeltakelsesmengdeText) {
    return null
  }

  return (
    <div className={className ?? ''}>
      <Heading level={headingLevel} size={headingSize}>
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
    </div>
  )
}
