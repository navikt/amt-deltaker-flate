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

interface DeltakelsesmengdeCommonProps extends DeltakelsesmengdeProps {
  hideWhenEmpty?: boolean
}

interface DeltakelsesmengdeSectionProps extends DeltakelsesmengdeCommonProps {
  headingText?: string
  headingLevel: '2' | '3'
  headingSize: 'medium' | 'small'
  headingClassName?: string
  bodyClassName?: string
  className?: string
}

interface DeltakelsesmengdeBodyLongSectionProps extends DeltakelsesmengdeCommonProps {
  headingText?: string
  headingClassName?: string
  bodyClassName?: string
}

interface DeltakelsesmengdeInlineProps extends DeltakelsesmengdeCommonProps {
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
  hideWhenEmpty = false,
  headingText = 'Deltakelsesmengde',
  headingLevel,
  headingSize,
  headingClassName,
  bodyClassName,
  className,
  ...props
}: DeltakelsesmengdeSectionProps) => {
  const text = getDeltakelsesmengdeText(props)

  if (text === null || !text) {
    return null
  }

  const content = (
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

  if (className) {
    return <div className={className}>{content}</div>
  }

  return content
}

export const DeltakelsesmengdeBodyLongSection = ({
  hideWhenEmpty = false,
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
  hideWhenEmpty = false,
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
