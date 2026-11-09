import type { ReactNode } from 'react'

interface ShowProps {
  if?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  children: ReactNode
}

export const Show = (props: ShowProps) =>
  props.if ? <>{props.children}</> : null
