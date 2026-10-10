import { BodyLong } from '@navikt/ds-react'
import { Tiltakskode } from '../model/deltaker'
import { deltakerprosentText } from '../utils/displayText'
import { harDeltakelsesmengde } from '../utils/utils'

interface DeltakelsesmengdeProps {
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
  deltakelsesprosent: number | null
  dagerPerUke: number | null
}

interface DeltakelsesmengdeBodyLongSectionProps extends DeltakelsesmengdeProps {
  headingText?: string
  headingClassName?: string
  bodyClassName?: string
}

interface DeltakelsesmengdeInlineProps extends DeltakelsesmengdeProps {
  prefix?: string
  className?: string
}

export const getDeltakelsesmengdeText = ({
  tiltakskode,
  erEnkeltplass,
  deltakelsesprosent,
  dagerPerUke
}: DeltakelsesmengdeProps): string | null => {
  if (!harDeltakelsesmengde({ tiltakskode, erEnkeltplass })) {
    return null
  }
  return deltakerprosentText(deltakelsesprosent, dagerPerUke, erEnkeltplass)
}

// TODO: Bruk semantisk Heading når historikken tilbyr korrekt overskriftsnivå.
export const DeltakelsesmengdeBodyLongSection = ({
  headingText = 'Deltakelsesmengde',
  headingClassName,
  bodyClassName,
  ...props
}: DeltakelsesmengdeBodyLongSectionProps) => {
  const text = getDeltakelsesmengdeText(props)

  if (text === null || !text) {
    return null
  }

  return (
    <>
      <BodyLong size="small" weight="semibold" className={headingClassName}>
        {headingText}
      </BodyLong>
      <BodyLong size="small" className={bodyClassName}>
        {text}
      </BodyLong>
    </>
  )
}

export const DeltakelsesmengdeInline = ({
  prefix = 'Deltakelsesmengde:',
  className,
  ...props
}: DeltakelsesmengdeInlineProps) => {
  const text = getDeltakelsesmengdeText(props)

  if (text === null || !text) {
    return null
  }

  return (
    <BodyLong size="small" className={className}>
      {`${prefix} ${text}`.trim()}
    </BodyLong>
  )
}
