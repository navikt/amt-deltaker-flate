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
  // Ref-en låser handlingen umiddelbart, før React rekker å vise loading.
  // Låsen frigjøres i finally, slik at brukeren kan prøve igjen etter feil.
  const tilbakekallingUnderveisRef = useRef(false)

  const handleClick = () => {
    if (tilbakekallingUnderveisRef.current || isResolved(tilbakekallPromise))
      return
    tilbakekallingUnderveisRef.current = true
    tilbakekallPromise.reset()

    tilbakekallPromise.setPromise(
      tilbakekallForslag(deltakerId, forslagId)
        .then(() => onTilbakekalt(forslagId))
        .finally(() => {
          tilbakekallingUnderveisRef.current = false
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
