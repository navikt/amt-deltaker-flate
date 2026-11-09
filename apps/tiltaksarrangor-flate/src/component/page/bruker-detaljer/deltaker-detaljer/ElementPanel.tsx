import { BodyShort } from '@navikt/ds-react'
import cls from 'classnames'
import type { ReactNode } from 'react'
import styles from './ElementPanel.module.scss'

interface ElementPanelProps {
  tittel: string
  className?: string
  children: ReactNode
}

export const ElementPanel = ({
  tittel,
  children,
  className
}: ElementPanelProps) => {
  return (
    <div className={cls(styles.wrapper, className)}>
      <BodyShort size="small">
        <span className={styles.tittel}>{tittel}</span>
        {children}
      </BodyShort>
    </div>
  )
}
