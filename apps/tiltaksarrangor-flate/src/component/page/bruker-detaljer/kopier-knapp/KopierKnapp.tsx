import { Button } from '@navikt/ds-react'
import cls from 'classnames'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './KopierKnapp.module.scss'

interface KopierKnappProps {
  kopierTekst: string
  children: ReactNode
  className?: string
  ariaLabel?: string
}

const COPY_TOOLTIP_DURATION_MS = 1000

export const KopierKnapp = (props: KopierKnappProps) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false)

  const handleOnClick = () => {
    navigator.clipboard
      .writeText(props.kopierTekst)
      .then(() => setCopySuccess(true))
      .catch(() => setCopySuccess(false))
  }

  useEffect(() => {
    if (copySuccess) {
      const timeOutId = window.setTimeout(
        () => setCopySuccess(false),
        COPY_TOOLTIP_DURATION_MS
      )

      return () => clearTimeout(timeOutId)
    }
  }, [copySuccess])

  return (
    <div className={styles.wrapper}>
      <Button
        onClick={handleOnClick}
        aria-label={props.ariaLabel}
        className={cls(styles.kopierKnapp, props.className)}
      >
        {props.children}
      </Button>
      <span
        className={cls(styles.tooltip, {
          [styles.tooltipVisible]: copySuccess
        })}
      >
        Kopiert
      </span>
    </div>
  )
}
