import { BodyShort } from '@navikt/ds-react'
import cls from 'classnames'
import type { ReactNode } from 'react'
import { EMDASH } from '../../../../utils/constants'
import styles from './IconLabel.module.scss'

interface IconLabelProps {
  labelValue: string | undefined | null
  icon: ReactNode
  iconWrapperClassName?: string
}

export function IconLabel(props: IconLabelProps) {
  return (
    <div className={styles.iconWrapper}>
      <div
        className={cls(styles.iconLabelIconWrapper, props.iconWrapperClassName)}
      >
        {props.icon}
      </div>
      <BodyShort className={styles.labelValue}>
        {props.labelValue || EMDASH}
      </BodyShort>
    </div>
  )
}
