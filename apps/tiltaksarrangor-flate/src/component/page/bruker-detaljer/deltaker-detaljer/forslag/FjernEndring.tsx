import { Alert, Box, Button } from '@navikt/ds-react'
import { useRef } from 'react'
import { settSvarFraNavSomLest } from '../../../../../api/endring-api'
import {
  isPending,
  isRejected,
  usePromise
} from '../../../../../utils/use-promise'
import styles from './AktivtForslagPanel.module.scss'

export interface Props {
  endringId: string
  deltakerId: string
  onMarkertSomLest: (endringId: string) => void
}

export const FjernEndring = ({
  endringId,
  deltakerId,
  onMarkertSomLest
}: Props) => {
  const markerSomLestPromise = usePromise<void>()
  const inFlightRef = useRef(false)

  const handleLestForslag = () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    markerSomLestPromise.reset()

    markerSomLestPromise.setPromise(
      settSvarFraNavSomLest(deltakerId, endringId)
        .then(() => onMarkertSomLest(endringId))
        .finally(() => {
          inFlightRef.current = false
        })
    )
  }

  return (
    <Box
      background="accent-moderate"
      className={styles.marker_som_lest_box}
      borderRadius="0 0 4 4"
    >
      <div className={styles.marker_som_lest_knapp_wrapper}>
        <Button
          size="small"
          loading={isPending(markerSomLestPromise)}
          onClick={handleLestForslag}
        >
          Marker som lest
        </Button>
      </div>
      {isRejected(markerSomLestPromise) && (
        <Alert variant="error" role="alert">
          Kunne ikke markere meldingen som lest. Prøv igjen.
        </Alert>
      )}
    </Box>
  )
}
