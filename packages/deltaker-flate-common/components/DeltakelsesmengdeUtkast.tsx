import { BodyLong, Heading } from '@navikt/ds-react'
import { Tiltakskode } from '../model/deltaker'
import { getDeltakelsesmengdeText } from './DeltakelsesmengdeVisning'

interface Props {
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  headingText?: string
  headingLevel: '2' | '3'
  headingSize: 'medium' | 'small'
  headingClassName?: string
  bodyClassName?: string
}

export const DeltakelsesmengdeUtkast = ({
  headingText = 'Deltakelsesmengde',
  headingLevel,
  headingSize,
  headingClassName,
  bodyClassName,
  ...props
}: Props) => {
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
