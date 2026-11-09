import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './IkonLenke.module.scss'

interface Props {
  to: string
  text: string
  ikon: ReactNode
  className?: string
}

export const IkonLenke = (props: Props) => {
  return (
    <div className={props.className}>
      <Link className={styles.lenke} to={props.to}>
        {props.ikon}
        {props.text}
      </Link>
    </div>
  )
}
