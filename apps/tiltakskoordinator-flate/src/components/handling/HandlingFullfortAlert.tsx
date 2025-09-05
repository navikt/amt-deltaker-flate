import { Alert } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useHandlingContext } from '../../context-providers/HandlingContext'

export const HandlingFullfortAlert = () => {
  const [melding, setMelding] = useState<string | null>(null)
  const { handlingUtfortText, setHandlingUtfortText } = useHandlingContext()

  useEffect(() => {
    if (handlingUtfortText) {
      setTimeout(() => {
        // Timeout pga vi setter fokus på handling-knappen, må skjermleser kunne lese opp endringen.
        setMelding(handlingUtfortText)
      }, 300)
      setTimeout(() => {
        setMelding(null)
        setHandlingUtfortText(null)
      }, 15 * 1000)
    }
  }, [handlingUtfortText])

  return (
    <>
      <p aria-live="polite" aria-atomic={true} className="sr-only">
        {melding ?? ''}
      </p>

      {melding ? (
        <div className="sticky bottom-32 left-0 right-0 mb-20">
          <Alert
            closeButton
            variant="success"
            size="small"
            onClose={() => setMelding(null)}
            className="m-auto mt-4"
          >
            {melding}
          </Alert>
        </div>
      ) : null}
    </>
  )
}
