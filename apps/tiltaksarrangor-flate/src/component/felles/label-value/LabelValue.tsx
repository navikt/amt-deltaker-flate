import { BodyShort, Label } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import styles from './LabelValue.module.scss'

interface Props {
  textColor?: 'subtle' | 'default'
  title: string
  children: ReactNode
}

export const LabelValue = ({ textColor, title, children }: Props) => (
  <BodyShort size="small" className={styles.wrapper}>
    <Label
      className={styles.label}
      textColor={textColor ?? 'default'}
      size="small"
    >
      {title}:
    </Label>
    {children}
  </BodyShort>
)
