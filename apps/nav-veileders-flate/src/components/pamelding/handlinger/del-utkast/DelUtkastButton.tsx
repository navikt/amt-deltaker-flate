import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DelUtkastEnkeltPlassModal } from './DelUtkastEnkeltPlassModal.tsx'
import { usePameldingFormContext } from '../../PameldingFormContext.tsx'
import { useDeltakerContext } from '../../../tiltak/DeltakerContext.tsx'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues.ts'
import { DelUtkastModal } from './DelUtkastModal.tsx'
import { PameldingFormValues } from '../../../../model/PameldingFormValues.ts'
import { erEnkeltPlass } from '../../../../utils/pamelding-ekeltplass.ts'

export const DelUtkastButton = () => {
  const { disabled } = usePameldingFormContext()
  const { deltaker } = useDeltakerContext()
  const [modalOpen, setModalOpen] = useState(false)

  const erEnkeltplass = erEnkeltPlass(deltaker)
  const { handleSubmit } = useFormContext<
    PameldingFormValues | PameldingEnkeltplassFormValues
  >()

  return (
    <>
      <Button
        onClick={handleSubmit(() => setModalOpen(true))}
        size="small"
        disabled={disabled}
        type="button"
      >
        Del utkast med brukeren
      </Button>

      {erEnkeltplass && (
        <DelUtkastEnkeltPlassModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
      {!erEnkeltplass && (
        <DelUtkastModal open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
