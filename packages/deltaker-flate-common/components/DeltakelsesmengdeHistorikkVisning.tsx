import { BodyLong } from '@navikt/ds-react'
import { Tiltakskode } from '../model/deltaker'
import { getDeltakelsesmengdeText } from './DeltakelsesmengdeInfo'

interface DeltakelsesmengdeProps {
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
  deltakelsesprosent: number | null
  dagerPerUke: number | null
}

interface DeltakelsesmengdeBodyLongSectionProps extends DeltakelsesmengdeProps {
  className?: string
}

interface DeltakelsesmengdeInlineProps extends DeltakelsesmengdeProps {
  className?: string
}

export const DeltakelsesmengdeBodyLongSection = ({
  className,
  ...props
}: DeltakelsesmengdeBodyLongSectionProps) => {
  const text = getDeltakelsesmengdeText(
    props.tiltakskode,
    props.erEnkeltplass,
    props.deltakelsesprosent,
    props.dagerPerUke
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
  className,
  ...props
}: DeltakelsesmengdeInlineProps) => {
  const text = getDeltakelsesmengdeText(
    props.tiltakskode,
    props.erEnkeltplass,
    props.deltakelsesprosent,
    props.dagerPerUke
  )

  return text ? (
    <BodyLong size="small" className={className}>
      {`Deltakelsesmengde: ${text}`.trim()}
    </BodyLong>
  ) : null
}
