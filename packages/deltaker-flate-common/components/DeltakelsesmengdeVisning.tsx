import { ReactNode } from 'react'
import { Tiltakskode } from '../model/deltaker'
import { deltakerprosentText } from '../utils/displayText'
import { harDeltakelsesmengde } from '../utils/utils'

interface DeltakelsesmengdeProps {
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
  deltakelsesprosent: number | null
  dagerPerUke: number | null
}

interface DeltakelsesmengdeVisningProps extends DeltakelsesmengdeProps {
  hideWhenEmpty?: boolean
  children: (text: string) => ReactNode
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

export const DeltakelsesmengdeVisning = ({
  hideWhenEmpty = false,
  children,
  ...props
}: DeltakelsesmengdeVisningProps) => {
  const text = getDeltakelsesmengdeText(props)

  if (text === null || (hideWhenEmpty && !text)) {
    return null
  }

  return <>{children(text)}</>
}
