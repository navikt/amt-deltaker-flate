import { BodyShort, Heading } from '@navikt/ds-react'
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
}

export const DeltakelsesmengdeUtkast = ({
  headingText = 'Deltakelsesmengde',
  headingLevel,
  headingSize,
  headingClassName,
  ...props
}: Props) => {
  const text = getDeltakelsesmengdeText(props)

  if (text === null || !text) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <Heading
        level={headingLevel}
        size={headingSize}
        className={headingClassName}
      >
        {headingText}
      </Heading>
      <BodyShort as="span" size="small">
        {text}
      </BodyShort>
    </div>
  )
}
