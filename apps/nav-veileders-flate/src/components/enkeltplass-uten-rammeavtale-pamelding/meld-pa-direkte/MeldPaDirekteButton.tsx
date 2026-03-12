import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { PameldingEnkeltplassFormValues } from '../../../model/PameldingEnkeltplassFormValues.ts'
import { MeldPaDirekteModal } from './MeldPaDirekteModal.tsx'

interface Props {
  disabled?: boolean
}

export const MeldPaDirekteButton = ({ disabled }: Props) => {
  const [modalOpen, setModalOpen] = useState(false)

  const { handleSubmit } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <>
      <Button
        onClick={handleSubmit(() => setModalOpen(true))}
        size="small"
        disabled={disabled}
        type="button"
        variant="secondary"
      >
        Meld på uten å dele utkast
      </Button>

      <MeldPaDirekteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
