import { BodyLong } from '@navikt/ds-react'
import { Tiltakskode } from '../model/deltaker'
import { getDeltakelsesmengdeText } from './DeltakelsesmengdeInfo'

interface DeltakelsesmengdeProps {
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  className?: string
}

export const DeltakelsesmengdeBodyLongSection = ({
  tiltakskode,
  erEnkeltplass,
  deltakelsesprosent,
  dagerPerUke,
  className
}: DeltakelsesmengdeProps) => {
  const text = getDeltakelsesmengdeText(
    tiltakskode,
    erEnkeltplass,
    deltakelsesprosent,
    dagerPerUke
  )

  return text ? (
    <div className={className}>
      <BodyLong size="small" weight="semibold">
        Deltakelsesmengde
      </BodyLong>
      <BodyLong size="small">{text}</BodyLong>
    </div>
  ) : null
}

export const DeltakelsesmengdeInline = ({
  tiltakskode,
  erEnkeltplass,
  deltakelsesprosent,
  dagerPerUke,
  className
}: DeltakelsesmengdeProps) => {
  const text = getDeltakelsesmengdeText(
    tiltakskode,
    erEnkeltplass,
    deltakelsesprosent,
    dagerPerUke
  )

  return text ? (
    <BodyLong size="small" className={className}>
      {`Deltakelsesmengde: ${text}`}
    </BodyLong>
  ) : null
}
