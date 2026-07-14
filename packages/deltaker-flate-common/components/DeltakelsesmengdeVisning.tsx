import { BodyLong, Heading } from '@navikt/ds-react'
import { Tiltakskode } from '../model/deltaker'
import { deltakerprosentText } from '../utils/displayText'
import { harDeltakelsesmengde } from '../utils/utils'

interface DeltakelsesmengdeProps {
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
  deltakelsesprosent: number | null
  dagerPerUke: number | null
}

interface DeltakelsesmengdeSectionProps extends DeltakelsesmengdeProps {
  headingText?: string
  headingLevel: '2' | '3'
  headingSize: 'medium' | 'small'
  headingClassName?: string
  bodyClassName?: string
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

export const DeltakelsesmengdeAvsnitt = ({
  headingText = 'Deltakelsesmengde',
  headingLevel,
  headingSize,
  headingClassName,
  bodyClassName,
  ...props
}: DeltakelsesmengdeSectionProps) => {
  const text = getDeltakelsesmengdeText(props)

  if (text === null || !text) {
    return null
  }

  return (
    <>
      <Heading
        level={headingLevel}
        size={headingSize}
        className={headingClassName}
      >
        {headingText}
      </Heading>
      <BodyLong size="small" className={bodyClassName}>
        {text}
      </BodyLong>
    </>
  )
}

/**
 * TODO: med korrekt semantisk HTML i historikken burde denne kunne erstattes med
 *   [DeltakelsesmengdeAvsnitt].
 */
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
