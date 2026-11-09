import { Loader } from '@navikt/ds-react'
import styles from './SpinnerPage.module.scss'

export const SpinnerPage = () => {
  return (
    <div className={styles.page}>
      <Loader size="2xlarge" />
    </div>
  )
}
