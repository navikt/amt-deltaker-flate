import { Alert } from '@navikt/ds-react'
import { useHandlingContext } from '../../context-providers/HandlingContext'
import { useEffect, useState } from 'react'

export const HandlingFullfortMedFeilAlert = () => {
  const { handlingFeiletText, setHandlingFeiletText } = useHandlingContext()
  const [melding, setMelding] = useState<string | null>(null)

  useEffect(() => {
    if (handlingFeiletText) {
      setTimeout(() => {
        // Timeout pga vi setter fokus på handling-knappen, må skjermleser kunne lese opp endringen.
        setMelding(handlingFeiletText)
      }, 300)
    }
  }, [handlingFeiletText])

  return (
    <>
      <p aria-live="polite" aria-atomic={true} className="sr-only">
        {melding ?? ''}
      </p>

      {melding ? (
        <div className="sticky bottom-32 left-0 right-0 mb-20">
          <Alert
            closeButton
            variant="warning"
            size="small"
            onClose={() => {
              setMelding(null)
              setHandlingFeiletText(null)
            }}
            className="m-auto mt-4"
          >
            {melding}
          </Alert>
        </div>
      ) : null}
    </>
  )
}
