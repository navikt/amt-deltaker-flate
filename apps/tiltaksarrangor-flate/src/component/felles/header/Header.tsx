import { Heading } from '@navikt/ds-react'
import React from 'react'
import { useTilbakelenkeContext } from '../../../store/TilbakelenkeContextProvider'
import { Tilbakelenke } from '../tilbakelenke/Tilbakelenke'
import styles from './Header.module.scss'

export const Header = (): React.ReactElement => {
  const { tilbakeTilUrl } = useTilbakelenkeContext()

  return (
    <nav className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.titleWrapper}>
          {tilbakeTilUrl && <Tilbakelenke to={tilbakeTilUrl} />}
        </div>
        <Heading size="medium" level="1" className={styles.title}>
          Deltakeroversikt
        </Heading>
      </div>
    </nav>
  )
}
