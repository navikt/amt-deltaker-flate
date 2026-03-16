import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues.ts'
import { DelUtkastModal } from './DelUtkastModal.tsx'
import { usePameldingFormContext } from '../PameldingFormContext.tsx'

export const DelUtkastButton = () => {
  const { disabled } = usePameldingFormContext()
  const [modalOpen, setModalOpen] = useState(false)

  const { handleSubmit } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <>
      <Button
        onClick={handleSubmit(() => setModalOpen(true))}
        size="small"
        disabled={disabled}
        type="button"
      >
        Del utkast med bruker
      </Button>

      <DelUtkastModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
