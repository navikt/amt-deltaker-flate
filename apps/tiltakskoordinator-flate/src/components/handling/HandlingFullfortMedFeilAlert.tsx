import { Alert } from '@navikt/ds-react'
import { useHandlingContext } from '../../context-providers/HandlingContext'

export const HandlingFullfortMedFeilAlert = () => {
  const { handlingFeiletText, setHandlingFeiletText } = useHandlingContext()

  const onClose = () => {
    setHandlingFeiletText(null)
  }

  if (!handlingFeiletText) return
  return (
    <div className="sticky bottom-32 left-0 right-0 mb-20">
      <Alert
        closeButton
        variant="warning"
        size="small"
        className="m-auto mt-4"
        onClose={onClose}
      >
        {handlingFeiletText}
      </Alert>
    </div>
  )
}
