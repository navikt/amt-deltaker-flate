import { XMarkIcon } from '@navikt/aksel-icons'
import { Alert, Button, Tooltip } from '@navikt/ds-react'
import { useRef } from 'react'
import { tilbakekallForslag } from '../../../../../api/forslag-api'
import {
  isPending,
  isRejected,
  isResolved,
  usePromise
} from '../../../../../utils/use-promise'
import styles from './AktivtForslagPanel.module.scss'

export interface Props {
  forslagId: string
  deltakerId: string
  onTilbakekalt: (forslagId: string) => void
}

export const FjernForslag = ({
  forslagId,
  deltakerId,
  onTilbakekalt
}: Props) => {
  const tilbakekallPromise = usePromise<void>()
  const inFlightRef = useRef(false)

  const handleClick = () => {
    if (inFlightRef.current || isResolved(tilbakekallPromise)) return
    inFlightRef.current = true
    tilbakekallPromise.reset()

    tilbakekallPromise.setPromise(
      tilbakekallForslag(deltakerId, forslagId)
        .then(() => onTilbakekalt(forslagId))
        .finally(() => {
          inFlightRef.current = false
        })
    )
  }

  return (
    <>
      <Tooltip content="Tilbakekall forslag" className={styles.tooltip}>
        <Button
          icon={<XMarkIcon aria-hidden />}
          loading={
            isPending(tilbakekallPromise) || isResolved(tilbakekallPromise)
          }
          variant="tertiary"
          size="small"
          onClick={handleClick}
          className={styles.closeButton}
          aria-label="Tilbakekall forslag"
        />
      </Tooltip>
      {isRejected(tilbakekallPromise) && (
        <Alert variant="error" role="alert">
          Kunne ikke tilbakekalle forslaget. Prøv igjen.
        </Alert>
      )}
    </>
  )
}
